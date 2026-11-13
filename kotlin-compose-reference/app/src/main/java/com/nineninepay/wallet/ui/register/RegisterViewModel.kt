package com.nineninepay.wallet.ui.register

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class RegisterUiState(
    val fullName: String = "",
    val phoneNumber: String = "",
    val email: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val agreeTerms: Boolean = false,
    val isPasswordVisible: Boolean = false,
    val isConfirmPasswordVisible: Boolean = false,
    val fullNameError: String? = null,
    val phoneError: String? = null,
    val emailError: String? = null,
    val passwordError: String? = null,
    val confirmPasswordError: String? = null,
    val termsError: String? = null,
    val successNotice: String? = null
)

class RegisterViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(RegisterUiState())
    val uiState: StateFlow<RegisterUiState> = _uiState.asStateFlow()

    fun onFullNameChanged(newName: String) {
        _uiState.update { it.copy(fullName = newName, fullNameError = null, successNotice = null) }
    }

    fun onPhoneChanged(newPhone: String) {
        _uiState.update { it.copy(phoneNumber = newPhone, phoneError = null, successNotice = null) }
    }

    fun onEmailChanged(newEmail: String) {
        _uiState.update { it.copy(email = newEmail, emailError = null, successNotice = null) }
    }

    fun onPasswordChanged(newPassword: String) {
        _uiState.update { it.copy(password = newPassword, passwordError = null, successNotice = null) }
    }

    fun onConfirmPasswordChanged(newConfirm: String) {
        _uiState.update { it.copy(confirmPassword = newConfirm, confirmPasswordError = null, successNotice = null) }
    }

    fun onAgreeTermsChanged(agreed: Boolean) {
        _uiState.update { it.copy(agreeTerms = agreed, termsError = null) }
    }

    fun onTogglePasswordVisibility() {
        _uiState.update { it.copy(isPasswordVisible = !it.isPasswordVisible) }
    }

    fun onToggleConfirmPasswordVisibility() {
        _uiState.update { it.copy(isConfirmPasswordVisible = !it.isConfirmPasswordVisible) }
    }

    fun onCreateAccountClicked() {
        val state = _uiState.value
        var hasError = false
        var nameErr: String? = null
        var phoneErr: String? = null
        var emailErr: String? = null
        var pwdErr: String? = null
        var confirmErr: String? = null
        var termsErr: String? = null

        // 1. Full name
        if (state.fullName.trim().isEmpty()) {
            nameErr = "Please enter your full name"
            hasError = true
        } else if (state.fullName.trim().length < 2) {
            nameErr = "Full name must be at least 2 characters"
            hasError = true
        }

        // 2. Phone number
        val digitsOnly = state.phoneNumber.filter { it.isDigit() }
        if (state.phoneNumber.trim().isEmpty()) {
            phoneErr = "Please enter your phone number for wallet linking"
            hasError = true
        } else if (digitsOnly.length < 9 || digitsOnly.length > 15) {
            phoneErr = "Please enter a valid phone number (+255 7XX XXX XXX or 07XXXXXXXX)"
            hasError = true
        }

        // 3. Email
        val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\$".toRegex()
        if (state.email.trim().isEmpty()) {
            emailErr = "Please enter your email address for account statements"
            hasError = true
        } else if (!emailRegex.matches(state.email.trim())) {
            emailErr = "Please enter a valid email address (e.g. name@domain.com)"
            hasError = true
        }

        // 4. Password strength
        if (state.password.isEmpty()) {
            pwdErr = "Please create a password"
            hasError = true
        } else if (state.password.length < 8) {
            pwdErr = "Password must be at least 8 characters long"
            hasError = true
        } else if (!state.password.any { it.isLetter() } || !state.password.any { it.isDigit() }) {
            pwdErr = "Password must contain both letters and numbers"
            hasError = true
        }

        // 5. Password matching
        if (state.confirmPassword.isEmpty()) {
            confirmErr = "Please confirm your password"
            hasError = true
        } else if (state.confirmPassword != state.password) {
            confirmErr = "Passwords do not match"
            hasError = true
        }

        // 6. Terms
        if (!state.agreeTerms) {
            termsErr = "You must agree to the Terms & Conditions and Privacy Policy"
            hasError = true
        }

        if (hasError) {
            _uiState.update {
                it.copy(
                    fullNameError = nameErr,
                    phoneError = phoneErr,
                    emailError = emailErr,
                    passwordError = pwdErr,
                    confirmPasswordError = confirmErr,
                    termsError = termsErr,
                    successNotice = null
                )
            }
            return
        }

        // Phase 2 Boundary: Local validation passes without fake accounts
        _uiState.update {
            it.copy(
                fullNameError = null,
                phoneError = null,
                emailError = null,
                passwordError = null,
                confirmPasswordError = null,
                termsError = null,
                successNotice = "Phase 2 Preview: All registration fields validated successfully. Account creation and secure credential storage will be connected when authentication is integrated."
            )
        }
    }

    fun onDismissNotice() {
        _uiState.update { it.copy(successNotice = null) }
    }
}
