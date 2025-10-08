"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ChevronDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Pencil,
  Trash2,
  EllipsisVertical,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTeamsStore } from "@/lib/store/teams-store"
import type { SortField, Team } from "@/lib/types"
import { CreateTeamModal } from "@/components/create-team-modal"
import { EditTeamModal } from "@/components/edit-team-modal"
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"
import { NotificationModal } from "@/components/notification-modal"

export function TeamsTable() {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchInput, setSearchInput] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null)
  const [isDeleteNotificationOpen, setIsDeleteNotificationOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const {
    filteredTeams,
    isLoading,
    searchQuery,
    sortField,
    sortOrder,
    selectedEntity,
    fetchTeams,
    setSearchQuery,
    setSortField,
    setSelectedEntity,
    deleteTeam,
  } = useTeamsStore()

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, setSearchQuery])

  const totalPages = Math.ceil(filteredTeams.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentTeams = filteredTeams.slice(startIndex, endIndex)

  const toggleTeam = (id: string) => {
    setSelectedTeams((prev) => (prev.includes(id) ? prev.filter((teamId) => teamId !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    setSelectedTeams((prev) =>
      prev.length === currentTeams.length && currentTeams.length > 0 ? [] : currentTeams.map((team) => team.id),
    )
  }

  const handleSort = (field: SortField) => {
    setSortField(field)
  }

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />
    return sortOrder === "asc" ? "↑" : "↓"
  }

  const handleEdit = (team: Team) => {
    console.log("[v0] Edit clicked for team:", team.name)
    setOpenDropdownId(null)
    setEditingTeam(team)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (team: Team) => {
    console.log("[v0] Delete clicked for team:", team.name)
    setOpenDropdownId(null)
    setDeletingTeam(team)
    setIsDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (deletingTeam) {
      console.log("[v0] Delete confirmed, deleting team:", deletingTeam.name)
      await deleteTeam(deletingTeam.id)
      console.log("[v0] Team deleted, showing notification")
      setIsDeleteConfirmOpen(false)
      setDeletingTeam(null)
      setIsDeleteNotificationOpen(true)
    }
  }

  const handleDeleteNotificationClose = (open: boolean) => {
    console.log("[v0] Delete notification closing, open:", open)
    setIsDeleteNotificationOpen(open)
    if (!open) {
      setDeletingTeam(null)
      setOpenDropdownId(null)
    }
  }

  const handleEditModalClose = (open: boolean) => {
    console.log("[v0] Edit modal closing, open:", open)
    setIsEditModalOpen(open)
    if (!open) {
      setEditingTeam(null)
      setOpenDropdownId(null)
    }
  }

  const entities = [
    "All Entities",
    "Access Bank Nigeria",
    "Access Bank Ghana",
    "Access Bank Angola",
    "Access Bank Zambia",
  ]

  return (
    <div className="space-y-4" role="region" aria-label="Teams management">
      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        role="search"
        aria-label="Filter teams"
      >
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by team name or code"
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search teams by name or code"
          />
        </div>
        <div className="flex gap-3 flex-wrap sm:flex-nowrap">
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger
              className="gap-2 bg-transparent flex-1 sm:flex-none sm:w-[240px]"
              aria-label="Filter by entity"
            >
              <span className="truncate">Entity: {selectedEntity}</span>
            </SelectTrigger>
            <SelectContent>
              {entities.map((entity) => (
                <SelectItem key={entity} value={entity}>
                  {entity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent flex-1 sm:flex-none" aria-label="Show more filters">
            More Filters
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <Button
          className="gap-2 bg-primary hover:bg-primary/90 sm:ml-auto"
          onClick={() => setIsCreateModalOpen(true)}
          aria-label="Create new team"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Create New Team</span>
          <span className="sm:hidden">New Team</span>
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
          <div className="text-muted-foreground">Loading teams...</div>
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div
          className="rounded-lg border border-border overflow-hidden"
          role="table"
          aria-label="Teams table"
          aria-rowcount={filteredTeams.length}
        >
          <div className="overflow-x-auto">
            <div className="bg-primary text-primary-foreground min-w-[900px]" role="rowgroup">
              <div
                className="grid grid-cols-[40px_1fr_100px_2fr_1.5fr_1fr_1fr_80px] gap-4 px-4 py-3 text-sm font-medium"
                role="row"
              >
                <div role="columnheader" aria-label="Select all teams">
                  <Checkbox
                    checked={selectedTeams.length === currentTeams.length && currentTeams.length > 0}
                    onCheckedChange={toggleAll}
                    className="border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                    aria-label={
                      selectedTeams.length === currentTeams.length && currentTeams.length > 0
                        ? "Deselect all teams"
                        : "Select all teams"
                    }
                  />
                </div>
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center hover:opacity-80 transition-opacity text-left"
                  role="columnheader"
                  aria-sort={sortField === "name" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                  aria-label={`Team Name, ${sortField === "name" ? `sorted ${sortOrder === "asc" ? "ascending" : "descending"}` : "not sorted"}`}
                >
                  Team Name {getSortIndicator("name")}
                </button>
                <button
                  onClick={() => handleSort("code")}
                  className="flex items-center hover:opacity-80 transition-opacity text-left"
                  role="columnheader"
                  aria-sort={sortField === "code" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                  aria-label={`Code, ${sortField === "code" ? `sorted ${sortOrder === "asc" ? "ascending" : "descending"}` : "not sorted"}`}
                >
                  Code {getSortIndicator("code")}
                </button>
                <div role="columnheader">Description</div>
                <div role="columnheader">Team Email</div>
                <button
                  onClick={() => handleSort("entity")}
                  className="flex items-center hover:opacity-80 transition-opacity text-left"
                  role="columnheader"
                  aria-sort={sortField === "entity" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                  aria-label={`Entity, ${sortField === "entity" ? `sorted ${sortOrder === "asc" ? "ascending" : "descending"}` : "not sorted"}`}
                >
                  Entity {getSortIndicator("entity")}
                </button>
                <button
                  onClick={() => handleSort("manager")}
                  className="flex items-center hover:opacity-80 transition-opacity text-left"
                  role="columnheader"
                  aria-sort={sortField === "manager" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                  aria-label={`Manager, ${sortField === "manager" ? `sorted ${sortOrder === "asc" ? "ascending" : "descending"}` : "not sorted"}`}
                >
                  Manager {getSortIndicator("manager")}
                </button>
                <div role="columnheader">Actions</div>
              </div>
            </div>
            <div className="bg-card divide-y divide-border min-w-[900px]" role="rowgroup">
              {currentTeams.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground" role="row">
                  <div role="cell" aria-colspan={8}>
                    No teams found
                  </div>
                </div>
              ) : (
                currentTeams.map((team, index) => (
                  <div
                    key={team.id}
                    className="grid grid-cols-[40px_1fr_100px_2fr_1.5fr_1fr_1fr_80px] gap-4 px-4 py-4 text-sm items-center hover:bg-muted/50"
                    role="row"
                    aria-rowindex={startIndex + index + 2}
                  >
                    <div role="cell">
                      <Checkbox
                        checked={selectedTeams.includes(team.id)}
                        onCheckedChange={() => toggleTeam(team.id)}
                        aria-label={`Select ${team.name}`}
                      />
                    </div>
                    <div className="font-medium" role="cell">
                      {team.name}
                    </div>
                    <div className="text-muted-foreground" role="cell">
                      {team.code}
                    </div>
                    <div className="text-muted-foreground truncate" role="cell">
                      {team.description}
                    </div>
                    <div className="text-muted-foreground truncate" role="cell">
                      {team.email}
                    </div>
                    <div className="text-muted-foreground" role="cell">
                      {team.entity}
                    </div>
                    <div className="flex items-center gap-2" role="cell">
                      <Avatar
                        className="h-8 w-8 bg-primary text-primary-foreground"
                        aria-label={`Manager: ${team.manager.name}`}
                      >
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                          {team.manager.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">{team.manager.name}</span>
                    </div>
                    <div className="flex items-center justify-center" role="cell">
                      <DropdownMenu
                        open={openDropdownId === team.id}
                        onOpenChange={(open) => {
                          console.log("[v0] Dropdown state changed for team:", team.name, "open:", open)
                          setOpenDropdownId(open ? team.id : null)
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            aria-label={`Actions for ${team.name}`}
                          >
                            <EllipsisVertical className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => handleEdit(team)}
                            className="gap-2 cursor-pointer"
                            aria-label={`Edit ${team.name}`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                            <span>Edit Team</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(team)}
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            aria-label={`Delete ${team.name}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            <span>Delete Team</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filteredTeams.length > 0 && (
        <div
          className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4"
          role="navigation"
          aria-label="Pagination"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Page Size</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => {
                setPageSize(Number(val))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-20" aria-label="Select page size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 justify-center overflow-x-auto">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="flex-shrink-0 bg-transparent"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex-shrink-0 ${
                    currentPage === pageNum
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-transparent"
                  }`}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </Button>
              )
            })}
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="flex-shrink-0 bg-transparent"
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground whitespace-nowrap" aria-live="polite" aria-atomic="true">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-muted-foreground hidden md:inline">Go to page</span>
            <Input
              className="w-16 h-8"
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Number(e.target.value)
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page)
                }
              }}
              aria-label="Jump to page number"
            />
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      <CreateTeamModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />

      {/* Edit Team Modal */}
      {editingTeam && <EditTeamModal open={isEditModalOpen} onOpenChange={handleEditModalClose} team={editingTeam} />}

      {/* Delete Confirmation Modal */}
      {deletingTeam && (
        <DeleteConfirmModal
          open={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
          onConfirm={handleDeleteConfirm}
          teamName={deletingTeam.name}
        />
      )}

      {/* Delete Success Notification */}
      <NotificationModal
        open={isDeleteNotificationOpen}
        onOpenChange={handleDeleteNotificationClose}
        title="Team Deleted Successfully"
        description="The team has been removed from the system."
      />
    </div>
  )
}
