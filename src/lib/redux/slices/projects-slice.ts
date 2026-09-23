import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockProjects, type Project } from "@/lib/mock/projects";

interface ProjectsState {
  items: Project[];
}

const initialState: ProjectsState = {
  items: mockProjects,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject(state, action: PayloadAction<Project>) {
      state.items.unshift(action.payload);
    },
    updateProject(state, action: PayloadAction<{ id: string; changes: Partial<Project> }>) {
      const project = state.items.find((p) => p.id === action.payload.id);
      if (project) Object.assign(project, action.payload.changes);
    },
    deleteProject(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addProject, updateProject, deleteProject } = projectsSlice.actions;
export default projectsSlice.reducer;
