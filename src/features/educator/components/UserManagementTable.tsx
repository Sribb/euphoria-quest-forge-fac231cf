import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, UserCog, Mail, MoreHorizontal, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import type { UserWithProgress } from "../hooks/useEducatorData";

interface UserManagementTableProps {
  users: UserWithProgress[] | undefined;
  isLoading: boolean;
  onUpdateRole: (params: { userId: string; role: string }) => void;
  onSendMessage: (userId: string) => void;
}

export const UserManagementTable = ({
  users,
  isLoading,
  onUpdateRole,
  onSendMessage,
}: UserManagementTableProps) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");

  const filteredUsers = users
    ?.filter((user) => {
      const matchesSearch =
        user.display_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.username?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.display_name || "").localeCompare(b.display_name || "");
        case "progress":
          return b.lessons_completed - a.lessons_completed;
        case "score":
          return b.avg_quiz_score - a.avg_quiz_score;
        case "level":
          return b.level - a.level;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "educator":
        return "default";
      case "mentor":
        return "secondary";
      default:
        return "outline";
    }
  };

  const exportToCSV = () => {
    if (!filteredUsers) return;

    const headers = ["Name", "Username", "Role", "Level", "XP", "Lessons Completed", "Avg Quiz Score", "Joined"];
    const rows = filteredUsers.map((user) => [
      user.display_name || "",
      user.username || "",
      user.role || "user",
      user.level,
      user.experience_points,
      user.lessons_completed,
      user.avg_quiz_score,
      format(new Date(user.created_at), "yyyy-MM-dd"),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Students</SelectItem>
              <SelectItem value="mentor">Mentors</SelectItem>
              <SelectItem value="educator">Educators</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="score">Quiz Score</SelectItem>
              <SelectItem value="level">Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Level</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="hidden lg:table-cell">Quiz Avg</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <div className="h-12 bg-muted animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredUsers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>
                            {(user.display_name || user.username || "U")[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {user.display_name || user.username || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            Level {user.level}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={getRoleBadgeVariant(user.role || "user")}>
                        {user.role || "user"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="font-medium">{user.level}</span>
                      <span className="text-muted-foreground text-xs ml-1">
                        ({user.experience_points} XP)
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.min(user.lessons_completed * 4, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {user.lessons_completed} lessons
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className={user.avg_quiz_score >= 70 ? "text-green-500" : "text-yellow-500"}>
                        {user.avg_quiz_score}%
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onSendMessage(user.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateRole({ userId: user.id, role: "mentor" })}>
                            Assign as Mentor
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateRole({ userId: user.id, role: "educator" })}>
                            Assign as Educator
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateRole({ userId: user.id, role: "user" })}>
                            Set as Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          Showing {filteredUsers?.length || 0} of {users?.length || 0} users
        </p>
      </CardContent>
    </Card>
  );
};
