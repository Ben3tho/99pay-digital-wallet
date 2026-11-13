package com.nineninepay.wallet.ui.register

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nineninepay.wallet.ui.signin.NineNinePayLogo
import com.nineninepay.wallet.ui.theme.*

/**
 * 99Pay Digital Wallet - Phase 2: Premium Registration Screen
 *
 * Implements Material 3 inputs, phone/email validation for Tanzanian wallet linking,
 * password matching, and terms acceptance without fake accounts.
 */
@Composable
fun RegisterScreen(
    viewModel: RegisterViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    onNavigateToSignIn: () -> Unit = {},
    onOpenTerms: () -> Unit = {}
) {
    val uiState by viewModel.uiState.collectAsState()
    val scrollState = rememberScrollState()
    val focusManager = LocalFocusManager()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepEmeraldBlack)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .imePadding()
                .verticalScroll(scrollState)
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(8.dp))

            // Section A: Brand Header
            NineNinePayLogo()

            Spacer(modifier = Modifier.height(20.dp))

            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Start
            ) {
                Text(
                    text = "Create Your Account",
                    style = MaterialTheme.typography.headlineLarge,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryText
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Your cards and IDs, organized in one secure place.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = SecondaryText
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Section B: Full Name Field
            OutlinedTextField(
                value = uiState.fullName,
                onValueChange = viewModel::onFullNameChanged,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                placeholder = { Text("Enter your full name", color = SecondaryText.copy(alpha = 0.6f)) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        tint = if (uiState.fullNameError != null) ErrorColor else EmeraldGreen.copy(alpha = 0.8f)
                    )
                },
                isError = uiState.fullNameError != null,
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text, imeAction = ImeAction.Next),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = InputBackground,
                    unfocusedContainerColor = InputBackground,
                    errorContainerColor = InputBackground,
                    focusedBorderColor = EmeraldGreen,
                    unfocusedBorderColor = InputBorder,
                    errorBorderColor = ErrorColor,
                    focusedTextColor = PrimaryText,
                    unfocusedTextColor = PrimaryText
                )
            )
            uiState.fullNameError?.let {
                Text(it, color = ErrorColor, fontSize = 12.sp, modifier = Modifier.fillMaxWidth().padding(start = 14.dp, top = 4.dp))
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Section C: Phone Number Field (+255)
            OutlinedTextField(
                value = uiState.phoneNumber,
                onValueChange = viewModel::onPhoneChanged,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                placeholder = { Text("Enter your phone number", color = SecondaryText.copy(alpha = 0.6f)) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Phone,
                        contentDescription = null,
                        tint = if (uiState.phoneError != null) ErrorColor else EmeraldGreen.copy(alpha = 0.8f)
                    )
                },
                isError = uiState.phoneError != null,
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone, imeAction = ImeAction.Next),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = InputBackground,
                    unfocusedContainerColor = InputBackground,
                    errorContainerColor = InputBackground,
                    focusedBorderColor = EmeraldGreen,
                    unfocusedBorderColor = InputBorder,
                    errorBorderColor = ErrorColor,
                    focusedTextColor = PrimaryText,
                    unfocusedTextColor = PrimaryText
                )
            )
            uiState.phoneError?.let {
                Text(it, color = ErrorColor, fontSize = 12.sp, modifier = Modifier.fillMaxWidth().padding(start = 14.dp, top = 4.dp))
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Section D: Email Field
            OutlinedTextField(
                value = uiState.email,
                onValueChange = viewModel::onEmailChanged,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                placeholder = { Text("Enter your email address", color = SecondaryText.copy(alpha = 0.6f)) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Email,
                        contentDescription = null,
                        tint = if (uiState.emailError != null) ErrorColor else EmeraldGreen.copy(alpha = 0.8f)
                    )
                },
                isError = uiState.emailError != null,
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = InputBackground,
                    unfocusedContainerColor = InputBackground,
                    errorContainerColor = InputBackground,
                    focusedBorderColor = EmeraldGreen,
                    unfocusedBorderColor = InputBorder,
                    errorBorderColor = ErrorColor,
                    focusedTextColor = PrimaryText,
                    unfocusedTextColor = PrimaryText
                )
            )
            uiState.emailError?.let {
                Text(it, color = ErrorColor, fontSize = 12.sp, modifier = Modifier.fillMaxWidth().padding(start = 14.dp, top = 4.dp))
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Section E: Create Password Field
            OutlinedTextField(
                value = uiState.password,
                onValueChange = viewModel::onPasswordChanged,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                placeholder = { Text("Create a strong password", color = SecondaryText.copy(alpha = 0.6f)) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = null,
                        tint = if (uiState.passwordError != null) ErrorColor else EmeraldGreen.copy(alpha = 0.8f)
                    )
                },
                trailingIcon = {
                    IconButton(onClick = viewModel::onTogglePasswordVisibility) {
                        Icon(
                            imageVector = if (uiState.isPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                            contentDescription = "Toggle password visibility",
                            tint = SecondaryText.copy(alpha = 0.8f)
                        )
                    }
                },
                visualTransformation = if (uiState.isPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                isError = uiState.passwordError != null,
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = ImeAction.Next),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = InputBackground,
                    unfocusedContainerColor = InputBackground,
                    errorContainerColor = InputBackground,
                    focusedBorderColor = EmeraldGreen,
                    unfocusedBorderColor = InputBorder,
                    errorBorderColor = ErrorColor,
                    focusedTextColor = PrimaryText,
                    unfocusedTextColor = PrimaryText
                )
            )
            uiState.passwordError?.let {
                Text(it, color = ErrorColor, fontSize = 12.sp, modifier = Modifier.fillMaxWidth().padding(start = 14.dp, top = 4.dp))
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Section F: Confirm Password Field
            OutlinedTextField(
                value = uiState.confirmPassword,
                onValueChange = viewModel::onConfirmPasswordChanged,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                placeholder = { Text("Re-enter your password", color = SecondaryText.copy(alpha = 0.6f)) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = null,
                        tint = if (uiState.confirmPasswordError != null) ErrorColor else EmeraldGreen.copy(alpha = 0.8f)
                    )
                },
                trailingIcon = {
                    IconButton(onClick = viewModel::onToggleConfirmPasswordVisibility) {
                        Icon(
                            imageVector = if (uiState.isConfirmPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                            contentDescription = "Toggle confirm password visibility",
                            tint = SecondaryText.copy(alpha = 0.8f)
                        )
                    }
                },
                visualTransformation = if (uiState.isConfirmPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                isError = uiState.confirmPasswordError != null,
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = ImeAction.Done),
                keyboardActions = KeyboardActions(onDone = { focusManager.clearFocus(); viewModel.onCreateAccountClicked() }),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = InputBackground,
                    unfocusedContainerColor = InputBackground,
                    errorContainerColor = InputBackground,
                    focusedBorderColor = EmeraldGreen,
                    unfocusedBorderColor = InputBorder,
                    errorBorderColor = ErrorColor,
                    focusedTextColor = PrimaryText,
                    unfocusedTextColor = PrimaryText
                )
            )
            uiState.confirmPasswordError?.let {
                Text(it, color = ErrorColor, fontSize = 12.sp, modifier = Modifier.fillMaxWidth().padding(start = 14.dp, top = 4.dp))
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Section G: Terms and Privacy Checkbox
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Checkbox(
                    checked = uiState.agreeTerms,
                    onCheckedChange = viewModel::onAgreeTermsChanged,
                    colors = CheckboxDefaults.colors(checkedColor = EmeraldGreen, uncheckedColor = InputBorder, checkmarkColor = DeepEmeraldBlack)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "I agree to the Terms & Conditions and Privacy Policy.",
                    color = SecondaryText,
                    fontSize = 12.sp,
                    modifier = Modifier.clickable(onClick = onOpenTerms)
                )
            }
            uiState.termsError?.let {
                Text(it, color = ErrorColor, fontSize = 12.sp, modifier = Modifier.fillMaxWidth().padding(start = 14.dp, top = 4.dp))
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Section H: Create Account Button
            Button(
                onClick = { focusManager.clearFocus(); viewModel.onCreateAccountClicked() },
                modifier = Modifier.fillMaxWidth().height(54.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                contentPadding = PaddingValues()
            ) {
                Box(
                    modifier = Modifier.fillMaxSize().background(brush = GoldGradientBrush, shape = RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("Create Account", color = DeepEmeraldBlack, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }

            AnimatedVisibility(visible = uiState.successNotice != null) {
                uiState.successNotice?.let { msg ->
                    Surface(
                        modifier = Modifier.fillMaxWidth().padding(top = 16.dp),
                        shape = RoundedCornerShape(12.dp),
                        color = DarkEmerald,
                        border = androidx.compose.foundation.BorderStroke(1.dp, EmeraldGreen.copy(alpha = 0.4f))
                    ) {
                        Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Outlined.Info, contentDescription = null, tint = LuxuryGold)
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(msg, color = SecondaryText, fontSize = 13.sp)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Section I: Existing Account Footer
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text("Already have an account?", color = SecondaryText, fontSize = 14.sp)
                Spacer(modifier = Modifier.width(6.dp))
                Box(
                    modifier = Modifier
                        .heightIn(min = 44.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .clickable(onClick = onNavigateToSignIn)
                        .padding(horizontal = 8.dp, vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("Sign In", color = LuxuryGold, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
