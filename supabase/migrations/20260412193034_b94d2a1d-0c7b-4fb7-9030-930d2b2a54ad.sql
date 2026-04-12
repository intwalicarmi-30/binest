CREATE OR REPLACE FUNCTION public.get_admin_dashboard_summary()
 RETURNS TABLE(total_members bigint, total_expected numeric, total_collected numeric, outstanding numeric, fully_paid_count bigint, pending_count bigint, overdue_count bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH cycle AS (
    SELECT
      CASE WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 4
        THEN make_date(EXTRACT(YEAR FROM CURRENT_DATE)::int, 4, 1)
        ELSE make_date((EXTRACT(YEAR FROM CURRENT_DATE) - 1)::int, 4, 1)
      END AS cycle_start,
      CASE WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 4
        THEN make_date((EXTRACT(YEAR FROM CURRENT_DATE) + 1)::int, 3, 31)
        ELSE make_date(EXTRACT(YEAR FROM CURRENT_DATE)::int, 3, 31)
      END AS cycle_end,
      CASE WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 4
        THEN EXTRACT(MONTH FROM CURRENT_DATE)::int - 3
        ELSE EXTRACT(MONTH FROM CURRENT_DATE)::int + 9
      END AS months_elapsed
  ),
  member_stats AS (
    SELECT 
      m.id,
      50000 * (SELECT months_elapsed FROM cycle) AS expected_so_far,
      50000 * 12 AS annual_target,
      COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'completed'), 0) AS paid,
      CASE 
        WHEN COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'completed'), 0) >= 50000 * (SELECT months_elapsed FROM cycle) THEN 'paid'
        WHEN COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'completed'), 0) > 0 THEN 'partial'
        ELSE 'pending'
      END AS computed_status
    FROM public.members m
    LEFT JOIN public.transactions t 
      ON t.member_id = m.id 
      AND t.date >= (SELECT cycle_start FROM cycle)
      AND t.date <= (SELECT cycle_end FROM cycle)
    GROUP BY m.id
  )
  SELECT
    COUNT(*)::BIGINT AS total_members,
    COALESCE(SUM(expected_so_far), 0) AS total_expected,
    COALESCE(SUM(paid), 0) AS total_collected,
    COALESCE(SUM(expected_so_far) - SUM(paid), 0) AS outstanding,
    COUNT(*) FILTER (WHERE computed_status = 'paid')::BIGINT AS fully_paid_count,
    COUNT(*) FILTER (WHERE computed_status = 'partial')::BIGINT AS pending_count,
    COUNT(*) FILTER (WHERE computed_status = 'pending')::BIGINT AS overdue_count
  FROM member_stats;
$function$;