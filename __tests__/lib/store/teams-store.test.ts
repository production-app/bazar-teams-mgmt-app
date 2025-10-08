import { renderHook, act, waitFor } from "@testing-library/react"
import { useTeamsStore } from "@/lib/store/teams-store"
import type { Team } from "@/lib/types"

describe("useTeamsStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useTeamsStore())
    act(() => {
      result.current.teams = []
      result.current.filteredTeams = []
      result.current.searchQuery = ""
      result.current.sortField = null
      result.current.sortOrder = "asc"
      result.current.selectedEntity = "All Entities"
    })
  })

  describe("fetchTeams", () => {
    it("should fetch teams and set loading state", async () => {
      const { result } = renderHook(() => useTeamsStore())

      expect(result.current.teams).toHaveLength(0)

      act(() => {
        result.current.fetchTeams()
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.teams.length).toBeGreaterThan(0)
      expect(result.current.filteredTeams.length).toBeGreaterThan(0)
    })
  })

  describe("createTeam", () => {
    it("should create a new team", async () => {
      const { result } = renderHook(() => useTeamsStore())

      const newTeam = {
        name: "Test Team",
        code: "TEST-001",
        description: "Test team description",
        email: "test@example.com",
        entity: "Entity A",
        manager: {
          name: "John Doe",
          avatar: "/placeholder-user.jpg",
        },
      }

      await act(async () => {
        await result.current.createTeam(newTeam)
      })

      expect(result.current.teams).toHaveLength(1)
      expect(result.current.teams[0]).toMatchObject(newTeam)
      expect(result.current.teams[0].id).toBeDefined()
    })
  })

  describe("updateTeam", () => {
    it("should update an existing team", async () => {
      const { result } = renderHook(() => useTeamsStore())

      const team: Team = {
        id: "team-1",
        name: "Original Team",
        code: "ORIG-001",
        description: "Original description",
        email: "original@example.com",
        entity: "Entity A",
        manager: {
          name: "Jane Doe",
          avatar: "/placeholder-user.jpg",
        },
      }

      act(() => {
        result.current.teams = [team]
        result.current.filteredTeams = [team]
      })

      await act(async () => {
        await result.current.updateTeam("team-1", {
          name: "Updated Team",
          description: "Updated description",
        })
      })

      expect(result.current.teams[0].name).toBe("Updated Team")
      expect(result.current.teams[0].description).toBe("Updated description")
      expect(result.current.teams[0].code).toBe("ORIG-001") // Unchanged
    })
  })

  describe("deleteTeam", () => {
    it("should delete a team", async () => {
      const { result } = renderHook(() => useTeamsStore())

      const team: Team = {
        id: "team-1",
        name: "Test Team",
        code: "TEST-001",
        description: "Test description",
        email: "test@example.com",
        entity: "Entity A",
        manager: {
          name: "John Doe",
          avatar: "/placeholder-user.jpg",
        },
      }

      act(() => {
        result.current.teams = [team]
        result.current.filteredTeams = [team]
      })

      expect(result.current.teams).toHaveLength(1)

      await act(async () => {
        await result.current.deleteTeam("team-1")
      })

      expect(result.current.teams).toHaveLength(0)
      expect(result.current.filteredTeams).toHaveLength(0)
    })
  })

  describe("setSearchQuery", () => {
    it("should filter teams by search query", () => {
      const { result } = renderHook(() => useTeamsStore())

      const teams: Team[] = [
        {
          id: "team-1",
          name: "Alpha Team",
          code: "ALPHA-001",
          description: "Alpha description",
          email: "alpha@example.com",
          entity: "Entity A",
          manager: { name: "John Doe", avatar: "/placeholder-user.jpg" },
        },
        {
          id: "team-2",
          name: "Beta Team",
          code: "BETA-001",
          description: "Beta description",
          email: "beta@example.com",
          entity: "Entity B",
          manager: { name: "Jane Doe", avatar: "/placeholder-user.jpg" },
        },
      ]

      act(() => {
        result.current.teams = teams
        result.current.filterAndSortTeams()
      })

      expect(result.current.filteredTeams).toHaveLength(2)

      act(() => {
        result.current.setSearchQuery("Alpha")
      })

      expect(result.current.filteredTeams).toHaveLength(1)
      expect(result.current.filteredTeams[0].name).toBe("Alpha Team")
    })
  })

  describe("setSortField", () => {
    it("should sort teams by field in ascending order", () => {
      const { result } = renderHook(() => useTeamsStore())

      const teams: Team[] = [
        {
          id: "team-1",
          name: "Zulu Team",
          code: "ZULU-001",
          description: "Zulu description",
          email: "zulu@example.com",
          entity: "Entity A",
          manager: { name: "John Doe", avatar: "/placeholder-user.jpg" },
        },
        {
          id: "team-2",
          name: "Alpha Team",
          code: "ALPHA-001",
          description: "Alpha description",
          email: "alpha@example.com",
          entity: "Entity B",
          manager: { name: "Jane Doe", avatar: "/placeholder-user.jpg" },
        },
      ]

      act(() => {
        result.current.teams = teams
        result.current.filterAndSortTeams()
      })

      act(() => {
        result.current.setSortField("name")
      })

      expect(result.current.filteredTeams[0].name).toBe("Alpha Team")
      expect(result.current.filteredTeams[1].name).toBe("Zulu Team")
      expect(result.current.sortOrder).toBe("asc")
    })

    it("should toggle sort order when clicking same field", () => {
      const { result } = renderHook(() => useTeamsStore())

      const teams: Team[] = [
        {
          id: "team-1",
          name: "Alpha Team",
          code: "ALPHA-001",
          description: "Alpha description",
          email: "alpha@example.com",
          entity: "Entity A",
          manager: { name: "John Doe", avatar: "/placeholder-user.jpg" },
        },
        {
          id: "team-2",
          name: "Zulu Team",
          code: "ZULU-001",
          description: "Zulu description",
          email: "zulu@example.com",
          entity: "Entity B",
          manager: { name: "Jane Doe", avatar: "/placeholder-user.jpg" },
        },
      ]

      act(() => {
        result.current.teams = teams
        result.current.filterAndSortTeams()
      })

      act(() => {
        result.current.setSortField("name")
      })

      expect(result.current.sortOrder).toBe("asc")
      expect(result.current.filteredTeams[0].name).toBe("Alpha Team")

      act(() => {
        result.current.setSortField("name")
      })

      expect(result.current.sortOrder).toBe("desc")
      expect(result.current.filteredTeams[0].name).toBe("Zulu Team")
    })
  })

  describe("setSelectedEntity", () => {
    it("should filter teams by selected entity", () => {
      const { result } = renderHook(() => useTeamsStore())

      const teams: Team[] = [
        {
          id: "team-1",
          name: "Team A",
          code: "A-001",
          description: "Team A description",
          email: "a@example.com",
          entity: "Entity A",
          manager: { name: "John Doe", avatar: "/placeholder-user.jpg" },
        },
        {
          id: "team-2",
          name: "Team B",
          code: "B-001",
          description: "Team B description",
          email: "b@example.com",
          entity: "Entity B",
          manager: { name: "Jane Doe", avatar: "/placeholder-user.jpg" },
        },
      ]

      act(() => {
        result.current.teams = teams
        result.current.filterAndSortTeams()
      })

      expect(result.current.filteredTeams).toHaveLength(2)

      act(() => {
        result.current.setSelectedEntity("Entity A")
      })

      expect(result.current.filteredTeams).toHaveLength(1)
      expect(result.current.filteredTeams[0].entity).toBe("Entity A")
    })
  })
})
