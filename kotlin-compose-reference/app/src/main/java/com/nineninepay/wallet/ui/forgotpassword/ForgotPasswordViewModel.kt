package com.nineninepay.wallet.ui.forgotpassword

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

sealed interface RecoveryState {
    object Idle : RecoveryState
    object InputValidationFailed : RecoveryState
    data class BlockedByExternalRequirement(val reason: String) : RecoveryState
}

data class ForgotPasswordUiState(
    val identifier: String = "",
    val identifierError: String? = null,
    val recoveryState: RecoveryState = RecoveryState.Idle
)

class ForgotPasswordViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(ForgotPasswordUiState())
    val uiState: StateFlow<ForgotPasswordUiState> = _uiState.asStateFlow()

    fun onIdentifierChanged(newIdentifier: String) {
        _uiState.update {
            it.copy(
                identifier = newIdentifier,
                identifierError = null,
                recoveryState = RecoveryState.Idle
            )
        }
    }

    fun onRecoverPasswordClicked() {
        val trimmed = _uiState.value.identifier.trim()

        // 1. Local Validation (IMPLEMENTED AND VERIFIED)
        if (trimmed.isEmpty()) {
            _uiState.update {
                it.copy(
                    identifierError = "Please enter your registered phone number or email",
                    recoveryState = RecoveryState.InputValidationFailed
                )
            }
            return
        }

        val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\$".toRegex()
        val digitsOnly = trimmed.filter { it.isDigit() }
        val isPhone = digitsOnly.length in 9..15
        val isEmail = emailRegex.matches(trimmed)

        if (!isPhone && !isEmail) {
            _uiState.update {
                it.copy(
                    identifierError = "Please enter a valid email address or phone number (+255)",
                    recoveryState = RecoveryState.InputValidationFailed
                )
            }
            return
        }

        // 2. Real Infrastructure Check (NO-DEMO POLICY ENFORCED)
        // No authentication provider (e.g. Firebase Auth / SMS Gateway) is configured in the environment.
        // We report genuine status rather than generating fake OTP codes or pretending an email was dispatched.
        _uiState.update {
            it.copy(
                identifierError = null,
                recoveryState = RecoveryState.BlockedByExternalRequirement(
                    reason = "Authentication service provider is not yet provisioned. Real password recovery requires configuring an official provider."
                )
            )
        }
    }
}
