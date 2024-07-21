import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    alreadyDecidedPosition: user?.alreadyDecidedPosition ? user.alreadyDecidedPosition : false,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    isSuccessForgotPassword: false,
    isSuccessResetPassword: false,
    isSuccessRegisterByAdmin: false,
}

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        return await authService.login(user)
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Register user
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error) {
        const message = (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Register user by admin
export const registerByAdmin = createAsyncThunk('auth/register-by-admin', async (user, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await authService.registerByAdmin(user, token)
    } catch (error) {
        const message = (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Update my profile
export const update = createAsyncThunk('auth/update-profile', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await authService.update(data, token)
    } catch (error) {
        const message = (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Update my student profile
export const updateStudentProfile = createAsyncThunk('auth/update-student', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await authService.updateStudentProfile(data, token)
    } catch (error) {
        const message = (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Update my password
export const updateMyPassword = createAsyncThunk('auth/update-password', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await authService.updateMyPassword(data, token)
    } catch (error) {
        const message = (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout()
})

// Forgot password
export const forgotPassword = createAsyncThunk('auth/forgot-password', async (userData, thunkAPI) => {
    try {
        return await authService.forgotPassword(userData)
    } catch (error) {
        const message = (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Temporary password from admin
export const tempPassword = createAsyncThunk('auth/temp-password', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await authService.tempPassword(data, token)
    } catch (error) {
        const message = (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Decide position
export const decidePosition = createAsyncThunk('auth/decide-position', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await authService.decidePosition(data, token)
    } catch (error) {
        const message = (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
            state.isSuccessForgotPassword = false
            state.isSuccessResetPassword = false
            state.isSuccessRegisterByAdmin = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = null
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(registerByAdmin.pending, (state) => {
                state.isLoading = true
            })
            .addCase(registerByAdmin.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccessRegisterByAdmin = true
            })
            .addCase(registerByAdmin.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(update.pending, (state) => {
                state.isLoading = true
            })
            .addCase(update.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(update.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updateStudentProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateStudentProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(updateStudentProfile.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(updateMyPassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateMyPassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
                state.alreadyDecidedPosition = true
            })
            .addCase(updateMyPassword.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.alreadyDecidedPosition = false
            })
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccessForgotPassword = true
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(tempPassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(tempPassword.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccessResetPassword = true
            })
            .addCase(tempPassword.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(decidePosition.pending, (state) => {
                state.isLoading = true
            })
            .addCase(decidePosition.fulfilled, (state, action) => {
                state.isLoading = false
                state.alreadyDecidedPosition = true
                state.user = action.payload
            })
            .addCase(decidePosition.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },
})

export const { reset } = authSlice.actions
export default authSlice.reducer