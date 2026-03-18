import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  return (
    <div className="max-w-lg">
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Profile</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input defaultValue="Sarah" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input defaultValue="Okonkwo" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="admin@savecollective.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input defaultValue="+234 800 123 4567" />
          </div>
          <Button size="sm">Save Changes</Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Security</h2>
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button size="sm" variant="outline">Update Password</Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Organization</h2>
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input defaultValue="SaveCollective Group" />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input defaultValue="RWF" disabled />
          </div>
          <Button size="sm">Save</Button>
        </div>
      </div>
    </div>
  );
}
