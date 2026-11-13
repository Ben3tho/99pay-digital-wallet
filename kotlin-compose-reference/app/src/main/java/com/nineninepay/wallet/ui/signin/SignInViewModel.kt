package com.nineninepay.wallet.ui.signin

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class SignInUiState(
    val identifier: String = "",
    val password: String = "",
    val isPasswordVisible: Boolean = false,
    val rememberMe: Boolean = false,
    val identifierError: String? = null,
    val passwordError: String? = null,
    val infoMessage: String? = null
)

class SignInViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(SignInUiState())
    val uiState: StateFlow<SignInUiState> = _uiState.asStateFlow()

    fun onIdentifierChanged(newIdentifier: String) {
        _uiState.update {
            it.copy(
                identifier = newIdentifier,
                identifierError = null,
                infoMessage = null
            )
        }
    }

    fun onPasswordChanged(newPassword: String) {
        _uiState.update {
            it.copy(
                password = newPassword,
                passwordError = null,
                infoMessage = null
            )
        }
    }

    fun onTogglePasswordVisibility() {
        _uiState.update { it.copy(isPasswordVisible = !it.isPasswordVisible) }
    }

    fun onRememberMeChanged(checked: Boolean) {
        _uiState.update { it.copy(rememberMe = checked) }
    }

    fun onSignInClicked() {
        val currentIdentifier = _uiState.value.identifier.trim()
        val currentPassword = _uiState.value.password

        var hasError = false
        var identifierErr: String? = null
        var passwordErr: String? = null

        if (currentIdentifier.isEmpty()) {
            identifierErr = "Please enter your phone number or email"
            hasError = true
        }

        if (currentPassword.isEmpty()) {
            passwordErr = "Please enter your password"
            hasError = true
        }

        if (hasError) {
            _uiState.update {
                it.copy(
                    identifierError = identifierErr,
                    passwordError = passwordErr,
                    infoMessage = null
                )
            }
            return
        }

        // Phase 1: No fake authentication or dashboard navigation.
        _uiState.update {
            it.copy(
                identifierError = null,
                passwordError = null,
                infoMessage = "Phase 1 Preview: Inputs validated. Authentication service will be connected in a future development phase."
            )
        }
    }

    fun onDismissInfoMessage() {
        _uiState.update { it.copy(infoMessage = null) }
    }
}
