import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const tojsDate = (ts) => {
  if (!ts) return null;
  if (typeof ts.toDate === "function") {
    const d = ts.toDate();
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (ts && typeof ts.seconds === "number") {
    return new Date(ts.seconds * 1000).toISOString();
  }
  if (typeof ts === "number") {
    return new Date(ts).toISOString();
  }
  if (typeof ts === "string") {
    // assume already ISO or parseable
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
};

export const fetchBlogs = createAsyncThunk("fetchBlogs", async () => {
  try {
    const q = query(collection(db, "blogs"));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: tojsDate(data.createdAt),
      };
    });
    return list;
  } catch (error) {
    return rejectWithValue(err.message || "Failed to fetch blogs");
  }
});

export const deleteBlog = createAsyncThunk(
  "deleteBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "blogs", blogId));
      return blogId;
    } catch (error) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  "updateBlog",
  async ({id, updatedData}) => {
    const blogref = doc(db, "blogs", id);
    await updateDoc(blogref, updatedData);
    return {id, updatedData};
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    items: [],
    loading: "idle",
    error: null,
  },
  extraReducers: (builders) => {
    builders
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = "Success";
        state.items = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = "Failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((b) => b.id !== id);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateBlog.fulfilled,(state,action)=>{
      const { id, updatedData } = action.payload;
  const index = state.items.findIndex((b) => b.id === id);
  if (index !== -1) {
    state.items[index] = { ...state.items[index], ...updatedData };
  }
      })
  },
});

export default blogSlice.reducer;
