import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Player } from "@/types/player";
import { Pencil } from "lucide-react";

interface UpdatePlayerFormProps {
  player: Player;
  onUpdate: (playerId: string, data: Partial<Player>) => Promise<void>;
}

export function UpdatePlayerForm({ player, onUpdate }: UpdatePlayerFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Player>>({
    firstName: player.firstName,
    secondName: player.secondName,
    jerseyNumber: player.jerseyNumber,
    playerRole: player.playerRole,
    nationality: player.nationality,
    battingStyle: player.battingStyle,
    bowlingStyle: player.bowlingStyle,
    dateOfBirth: player.dateOfBirth,
    gender: player.gender,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(player.playerId!.toString(), formData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Player Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondName">Last Name</Label>
              <Input
                id="secondName"
                value={formData.secondName}
                onChange={(e) => setFormData({ ...formData, secondName: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jerseyNumber">Jersey Number</Label>
              <Input
                id="jerseyNumber"
                type="number"
                value={formData.jerseyNumber?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value ? parseInt(e.target.value) : undefined })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playerRole">Role</Label>
              <Select
                value={formData.playerRole}
                onValueChange={(value) => setFormData({ ...formData, playerRole: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Batsman">Batsman</SelectItem>
                  <SelectItem value="Bowler">Bowler</SelectItem>
                  <SelectItem value="All-rounder">All-rounder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="battingStyle">Batting Style</Label>
              <Select
                value={formData.battingStyle}
                onValueChange={(value) => setFormData({ ...formData, battingStyle: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select batting style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Right-handed">Right-handed</SelectItem>
                  <SelectItem value="Left-handed">Left-handed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bowlingStyle">Bowling Style</Label>
              <Select
                value={formData.bowlingStyle}
                onValueChange={(value) => setFormData({ ...formData, bowlingStyle: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bowling style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Right-arm fast">Right-arm fast</SelectItem>
                  <SelectItem value="Right-arm medium">Right-arm medium</SelectItem>
                  <SelectItem value="Right-arm off-spin">Right-arm off-spin</SelectItem>
                  <SelectItem value="Left-arm fast">Left-arm fast</SelectItem>
                  <SelectItem value="Left-arm medium">Left-arm medium</SelectItem>
                  <SelectItem value="Left-arm spin">Left-arm spin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender ? 'Male' : 'Female'}
              onValueChange={(value) => setFormData({ ...formData, gender: value === 'Male' ? true : false })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Player</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 