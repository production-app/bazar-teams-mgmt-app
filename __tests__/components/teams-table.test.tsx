import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TeamsTable } from "@/components/teams-table"
import { useTeamsStore } from "@/lib/store/teams-store"
import type { Team } from "@/lib/types"
import jest from "jest" // Import jest to declare it

// Mock the store
jest.mock("@/lib/store/teams-store")

describe("TeamsTable", () => {
  const mockTeams: Team[] = [
    {
      id: "team-1",
      name: "Alpha Team",
      code: "ALPHA-001",
      description: "Alpha team description",
      email: "alpha@example.com",
      entity: "Entity A",
      manager: { name: "John Doe", avatar: "/placeholder-user.jpg" },
    },
    {
      id: "team-2",
      name: "Beta Team",
      code: "BETA-001",
      description: "Beta team description",
      email: "beta@example.com",
      entity: "Entity B",
      manager: { name: "Jane Doe", avatar: "/placeholder-user.jpg" },
    },
  ]

  const mockSetSearchQuery = jest.fn()
  const mockSetSortField = jest.fn()
  const mockDeleteTeam = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTeamsStore as unknown as jest.Mock).mockReturnValue({
      filteredTeams: mockTeams,
      isLoading: false,
      searchQuery: "",
      sortField: null,
      sortOrder: "asc",
      setSearchQuery: mockSetSearchQuery,
      setSortField: mockSetSortField,
      deleteTeam: mockDeleteTeam,
    })
  })

  it("should render table with teams data", () => {
    render(<TeamsTable />)

    expect(screen.getByRole("table", { name: /teams data table/i })).toBeInTheDocument()
    expect(screen.getByText("Alpha Team")).toBeInTheDocument()
    expect(screen.getByText("Beta Team")).toBeInTheDocument()
    expect(screen.getByText("ALPHA-001")).toBeInTheDocument()
    expect(screen.getByText("BETA-001")).toBeInTheDocument()
  })

  it("should have proper table structure with ARIA roles", () => {
    render(<TeamsTable />)

    const table = screen.getByRole("table")
    expect(table).toBeInTheDocument()

    const columnHeaders = screen.getAllByRole("columnheader")
    expect(columnHeaders.length).toBeGreaterThan(0)

    const rows = screen.getAllByRole("row")
    expect(rows.length).toBeGreaterThan(1) // Header + data rows
  })

  it("should handle search input", async () => {
    const user = userEvent.setup()
    render(<TeamsTable />)

    const searchInput = screen.getByPlaceholderText(/search teams/i)
    await user.type(searchInput, "Alpha")

    expect(mockSetSearchQuery).toHaveBeenCalledWith("Alpha")
  })

  it("should handle column sorting", async () => {
    const user = userEvent.setup()
    render(<TeamsTable />)

    const nameHeader = screen.getByRole("button", { name: /team name/i })
    await user.click(nameHeader)

    expect(mockSetSortField).toHaveBeenCalledWith("name")
  })

  it("should open edit modal when edit button is clicked", async () => {
    const user = userEvent.setup()
    render(<TeamsTable />)

    const editButtons = screen.getAllByRole("button", { name: /edit team/i })
    await user.click(editButtons[0])

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /edit team/i })).toBeInTheDocument()
    })
  })

  it("should handle delete action", async () => {
    const user = userEvent.setup()
    mockDeleteTeam.mockResolvedValue(undefined)

    render(<TeamsTable />)

    const deleteButtons = screen.getAllByRole("button", { name: /delete team/i })
    await user.click(deleteButtons[0])

    // Confirm deletion
    const confirmButton = await screen.findByRole("button", { name: /delete/i })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(mockDeleteTeam).toHaveBeenCalledWith("team-1")
    })
  })

  it("should display pagination controls", () => {
    render(<TeamsTable />)

    expect(screen.getByRole("navigation", { name: /pagination/i })).toBeInTheDocument()
    expect(screen.getByText(/rows per page/i)).toBeInTheDocument()
  })

  it("should change rows per page", async () => {
    const user = userEvent.setup()
    render(<TeamsTable />)

    const rowsPerPageSelect = screen.getByRole("combobox", { name: /rows per page/i })
    await user.click(rowsPerPageSelect)

    const option20 = await screen.findByRole("option", { name: "20" })
    await user.click(option20)

    // Verify pagination updated
    await waitFor(() => {
      expect(screen.getByText(/20/)).toBeInTheDocument()
    })
  })

  it("should show loading state", () => {
    ;(useTeamsStore as unknown as jest.Mock).mockReturnValue({
      filteredTeams: [],
      isLoading: true,
      searchQuery: "",
      sortField: null,
      sortOrder: "asc",
      setSearchQuery: mockSetSearchQuery,
      setSortField: mockSetSortField,
      deleteTeam: mockDeleteTeam,
    })

    render(<TeamsTable />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("should show empty state when no teams", () => {
    ;(useTeamsStore as unknown as jest.Mock).mockReturnValue({
      filteredTeams: [],
      isLoading: false,
      searchQuery: "",
      sortField: null,
      sortOrder: "asc",
      setSearchQuery: mockSetSearchQuery,
      setSortField: mockSetSortField,
      deleteTeam: mockDeleteTeam,
    })

    render(<TeamsTable />)

    expect(screen.getByText(/no teams found/i)).toBeInTheDocument()
  })
})
