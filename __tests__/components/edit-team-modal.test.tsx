import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { EditTeamModal } from "@/components/edit-team-modal"
import { useTeamsStore } from "@/lib/store/teams-store"
import type { Team } from "@/lib/types"
import jest from "jest" // Import jest to declare it

// Mock the store
jest.mock("@/lib/store/teams-store")

describe("EditTeamModal", () => {
  const mockUpdateTeam = jest.fn()
  const mockOpen = true
  const mockOnOpenChange = jest.fn()

  const mockTeam: Team = {
    id: "team-1",
    name: "Existing Team",
    code: "EXIST-001",
    description: "Existing team description",
    email: "existing@example.com",
    entity: "Entity A",
    manager: {
      name: "Jane Doe",
      avatar: "/placeholder-user.jpg",
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTeamsStore as unknown as jest.Mock).mockReturnValue({
      updateTeam: mockUpdateTeam,
    })
  })

  it("should render the modal with pre-filled data", () => {
    render(<EditTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} team={mockTeam} />)

    expect(screen.getByRole("dialog", { name: /edit team/i })).toBeInTheDocument()
    expect(screen.getByDisplayValue("Existing Team")).toBeInTheDocument()
    expect(screen.getByDisplayValue("EXIST-001")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Existing team description")).toBeInTheDocument()
    expect(screen.getByDisplayValue("existing@example.com")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Jane Doe")).toBeInTheDocument()
  })

  it("should update team with modified data", async () => {
    const user = userEvent.setup()
    mockUpdateTeam.mockResolvedValue(undefined)

    render(<EditTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} team={mockTeam} />)

    // Modify team name
    const nameInput = screen.getByLabelText(/team name/i)
    await user.clear(nameInput)
    await user.type(nameInput, "Updated Team Name")

    // Submit form
    const submitButton = screen.getByRole("button", { name: /update team/i })
    await user.click(submitButton)

    // Confirm in confirmation modal
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /confirm update/i })).toBeInTheDocument()
    })

    const confirmButton = screen.getByRole("button", { name: /yes, update/i })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(mockUpdateTeam).toHaveBeenCalledWith("team-1", {
        name: "Updated Team Name",
        code: "EXIST-001",
        description: "Existing team description",
        email: "existing@example.com",
        entity: "Entity A",
        manager: {
          name: "Jane Doe",
          avatar: "/placeholder-user.jpg",
        },
      })
    })
  })

  it("should show validation errors for invalid data", async () => {
    const user = userEvent.setup()
    render(<EditTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} team={mockTeam} />)

    // Clear required field
    const nameInput = screen.getByLabelText(/team name/i)
    await user.clear(nameInput)

    const submitButton = screen.getByRole("button", { name: /update team/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/team name is required/i)).toBeInTheDocument()
    })
  })

  it("should have proper ARIA attributes", () => {
    render(<EditTeamModal open={mockOpen} onOpenChange={mockOnOpenChange} team={mockTeam} />)

    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAttribute("aria-labelledby")
    expect(dialog).toHaveAttribute("aria-describedby")

    const form = screen.getByRole("form")
    expect(form).toBeInTheDocument()
  })
})
