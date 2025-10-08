import { create } from "zustand"
import type { Team, SortField, SortOrder } from "../types"
import { generateTeams } from "../teams-data"

interface TeamsState {
  teams: Team[]
  filteredTeams: Team[]
  isLoading: boolean
  searchQuery: string
  sortField: SortField | null
  sortOrder: SortOrder
  selectedEntity: string

  // Actions
  fetchTeams: () => Promise<void>
  createTeam: (team: Omit<Team, "id">) => Promise<void>
  updateTeam: (id: string, team: Partial<Team>) => Promise<void>
  deleteTeam: (id: string) => Promise<void>
  setSearchQuery: (query: string) => void
  setSortField: (field: SortField) => void
  setSelectedEntity: (entity: string) => void
  filterAndSortTeams: () => void
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useTeamsStore = create<TeamsState>((set, get) => ({
  teams: [],
  filteredTeams: [],
  isLoading: false,
  searchQuery: "",
  sortField: null,
  sortOrder: "asc",
  selectedEntity: "All Entities",

  fetchTeams: async () => {
    set({ isLoading: true })
    await delay(500)
    const teams = generateTeams(500)
    set({ teams, isLoading: false })
    get().filterAndSortTeams()
  },

  createTeam: async (teamData) => {
    console.log("[v0] Creating team:", teamData.name)
    set({ isLoading: true })
    await delay(500)
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
    }
    set((state) => ({
      teams: [...state.teams, newTeam],
      isLoading: false,
    }))
    get().filterAndSortTeams()
    console.log("[v0] Team created successfully")
  },

  updateTeam: async (id, teamData) => {
    console.log("[v0] Updating team:", id, teamData)
    set({ isLoading: true })
    await delay(500)
    set((state) => ({
      teams: state.teams.map((team) => (team.id === id ? { ...team, ...teamData } : team)),
      isLoading: false,
    }))
    get().filterAndSortTeams()
    console.log("[v0] Team updated successfully, filtered teams count:", get().filteredTeams.length)
  },

  deleteTeam: async (id) => {
    console.log("[v0] Deleting team:", id)
    set({ isLoading: true })
    await delay(500)
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== id),
      isLoading: false,
    }))
    get().filterAndSortTeams()
    console.log("[v0] Team deleted successfully, filtered teams count:", get().filteredTeams.length)
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
    get().filterAndSortTeams()
  },

  setSortField: (field) => {
    const currentField = get().sortField
    const currentOrder = get().sortOrder

    if (currentField === field) {
      // Toggle order if same field
      set({ sortOrder: currentOrder === "asc" ? "desc" : "asc" })
    } else {
      // New field, default to ascending
      set({ sortField: field, sortOrder: "asc" })
    }
    get().filterAndSortTeams()
  },

  setSelectedEntity: (entity) => {
    set({ selectedEntity: entity })
    get().filterAndSortTeams()
  },

  filterAndSortTeams: () => {
    const { teams, searchQuery, sortField, sortOrder, selectedEntity } = get()

    let filtered = [...teams]

    // Filter by search query (name or code)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (team) => team.name.toLowerCase().includes(query) || team.code.toLowerCase().includes(query),
      )
    }

    // Filter by entity
    if (selectedEntity && selectedEntity !== "All Entities") {
      filtered = filtered.filter((team) => team.entity === selectedEntity)
    }

    // Sort
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: string
        let bValue: string

        if (sortField === "manager") {
          aValue = a.manager.name
          bValue = b.manager.name
        } else {
          aValue = a[sortField]
          bValue = b[sortField]
        }

        const comparison = aValue.localeCompare(bValue)
        return sortOrder === "asc" ? comparison : -comparison
      })
    }

    set({ filteredTeams: filtered })
  },
}))
