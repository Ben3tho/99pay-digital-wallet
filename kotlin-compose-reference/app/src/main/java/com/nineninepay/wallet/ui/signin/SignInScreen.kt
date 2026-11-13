package com.nineninepay.wallet.ui.signin

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material.icons.outlined.Fingerprint
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nineninepay.wallet.ui.theme.*

/**
 * 99Pay Digital Wallet - Phase 1: Premium Sign In Screen
 *
 * Designed with Deep Emerald Black, Luxury Gold, and Material 3 principles.
 * Optimized for Tanzanian users (support for +255 phone numbers and email).
 */
@Composable
fun SignInScreen(
    viewModel: SignInViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    onForgotPasswordClick: () -> Unit = {},
    onCreateAccountClick: () -> Unit = {},
    onBiometricClick: () -> Unit = {}
) {
    val uiState by viewModel.uiState.collectAsState()
    val scrollState = rememberScrollState()
    val focusManager = LocalFocusManager()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepEmeraldBlack)
    ) {
        // Decorative emerald curves and subtle background glow (does not interfere with readability)
        BackgroundAesthetics()

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
            Spacer(modifier = Modifier.height(16.dp))

            // Section B: Brand Logo
            NineNinePayLogo()

            Spacer(modifier = Modifier.height(28.dp))

            // Section C: Welcome Message
            WelcomeMessage()

            Spacer(modifier = Modifier.height(32.dp))

            // Section D: Email or Phone Number Input
            SignInInputField(
                value = uiState.identifier,
                onValueChange = viewModel::onIdentifierChanged,
                errorMessage = uiState.identifierError,
                keyboardActions = KeyboardActions(
                    onNext = { focusManager.clearFocus() }
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Section E: Password Input
            PasswordInputField(
                value = uiState.password,
                onValueChange = viewModel::onPasswordChanged,
                isPasswordVisible = uiState.isPasswordVisible,
                onToggleVisibility = viewModel::onTogglePasswordVisibility,
                errorMessage = uiState.passwordError,
                keyboardActions = KeyboardActions(
                    onDone = {
                        focusManager.clearFocus()
                        viewModel.onSignInClicked()
                    }
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Section F: Remember Me & Forgot Password
            RememberMeRow(
                rememberMe = uiState.rememberMe,
                onRememberMeChange = viewModel::onRememberMeChanged,
                onForgotPasswordClick = onForgotPasswordClick
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Section G: Primary Sign In Button
            SignInButton(
                onClick = {
                    focusManager.clearFocus()
                    viewModel.onSignInClicked()
                }
            )

            // Info banner explaining development phase (no fake authentication)
            AnimatedVisibility(
                visible = uiState.infoMessage != null,
                enter = fadeIn(),
                exit = fadeOut()
            ) {
                uiState.infoMessage?.let { msg ->
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 16.dp),
                        shape = RoundedCornerShape(12.dp),
                        color = DarkEmerald,
                        border = androidx.compose.foundation.BorderStroke(1.dp, EmeraldGreen.copy(alpha = 0.4f))
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.Info,
                                contentDescription = null,
                                tint = LuxuryGold,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = msg,
                                color = SecondaryText,
                                style = MaterialTheme.typography.bodyMedium,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            Spacer(modifier = Modifier.height(20.dp))

            // Section H: Biometric Sign-in Preview
            BiometricSignInOption(
                onClick = onBiometricClick
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Section I: Registration Navigation Footer
            CreateAccountFooter(
                onCreateAccountClick = onCreateAccountClick
            )

            // Safe bottom spacing to guarantee visibility above navigation bars
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

/**
 * Background decorative aesthetics: restrained emerald curves and subtle glows.
 */
@Composable
private fun BackgroundAesthetics() {
    Canvas(modifier = Modifier.fillMaxSize()) {
        val width = size.width
        val height = size.height

        // Top-right subtle emerald radial aura
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(EmeraldGreen.copy(alpha = 0.08f), Color.Transparent),
                center = Offset(width * 0.9f, height * 0.12f),
                radius = width * 0.7f
            )
        )

        // Bottom-left subtle luxury gold aura
        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(LuxuryGold.copy(alpha = 0.05f), Color.Transparent),
                center = Offset(width * 0.1f, height * 0.85f),
                radius = width * 0.6f
            )
        )

        // Elegant curved hairline in deep emerald
        val path = Path().apply {
            moveTo(0f, height * 0.22f)
            cubicTo(
                width * 0.45f, height * 0.18f,
                width * 0.65f, height * 0.28f,
                width, height * 0.20f
            )
        }
        drawPath(
            path = path,
            color = EmeraldGreen.copy(alpha = 0.07f),
            style = Stroke(width = 1.5f)
        )
    }
}

/**
 * Section B: Brand Logo Component
 * Number "99" as the central gold & emerald emblem, followed by "Pay" in crisp white.
 */
@Composable
fun NineNinePayLogo(
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            // Stylized 99 Emblem with Gold-Emerald Accent
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(
                        Brush.linearGradient(
                            listOf(DarkEmerald, Color(0xFF041913))
                        )
                    )
                    .border(
                        1.dp,
                        Brush.linearGradient(
                            listOf(LuxuryGoldLight.copy(alpha = 0.6f), EmeraldGreen.copy(alpha = 0.4f))
                        ),
                        RoundedCornerShape(14.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "99",
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 22.sp,
                    letterSpacing = (-0.5).sp,
                    color = LuxuryGold
                )
            }

            Spacer(modifier = Modifier.width(10.dp))

            // Brand Typography: 99Pay
            Row(verticalAlignment = Alignment.Bottom) {
                Text(
                    text = "99",
                    fontWeight = FontWeight.Bold,
                    fontSize = 30.sp,
                    letterSpacing = (-0.5).sp,
                    color = EmeraldGreen
                )
                Text(
                    text = "Pay",
                    fontWeight = FontWeight.Bold,
                    fontSize = 30.sp,
                    letterSpacing = (-0.5).sp,
                    color = PrimaryText
                )
            }
        }

        Spacer(modifier = Modifier.height(6.dp))

        // Brand positioning / supporting subtitle
        Text(
            text = "One App. All Your Cards.",
            style = MaterialTheme.typography.bodyMedium,
            color = SecondaryText,
            fontSize = 13.sp,
            letterSpacing = 0.2.sp
        )
    }
}

/**
 * Section C: Welcome Message
 */
@Composable
fun WelcomeMessage(
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.Start
    ) {
        Text(
            text = "Welcome Back",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            color = PrimaryText
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = "Sign in to access your cards and IDs.",
            style = MaterialTheme.typography.bodyLarge,
            color = SecondaryText
        )
    }
}

/**
 * Section D: Email or Phone Number Input Field
 * Supports user-friendly Tanzanian phone format (+255) or email.
 */
@Composable
fun SignInInputField(
    value: String,
    onValueChange: (String) -> Unit,
    errorMessage: String? = null,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    modifier: Modifier = Modifier
) {
    val isError = errorMessage != null

    Column(modifier = modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            placeholder = {
                Text(
                    text = "Phone number (+255) or email",
                    color = SecondaryText.copy(alpha = 0.6f),
                    fontSize = 15.sp
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    tint = if (isError) ErrorColor else EmeraldGreen.copy(alpha = 0.8f),
                    modifier = Modifier.size(20.dp)
                )
            },
            isError = isError,
            singleLine = true,
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Email,
                imeAction = ImeAction.Next
            ),
            keyboardActions = keyboardActions,
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = InputBackground,
                unfocusedContainerColor = InputBackground,
                errorContainerColor = InputBackground,
                focusedBorderColor = EmeraldGreen,
                unfocusedBorderColor = InputBorder,
                errorBorderColor = ErrorColor,
                focusedTextColor = PrimaryText,
                unfocusedTextColor = PrimaryText,
                cursorColor = EmeraldGreen
            )
        )

        if (isError) {
            Text(
                text = errorMessage.orEmpty(),
                color = ErrorColor,
                style = MaterialTheme.typography.bodyMedium,
                fontSize = 12.sp,
                modifier = Modifier.padding(start = 14.dp, top = 4.dp)
            )
        }
    }
}

/**
 * Section E: Password Input Field with Visibility Toggle
 */
@Composable
fun PasswordInputField(
    value: String,
    onValueChange: (String) -> Unit,
    isPasswordVisible: Boolean,
    onToggleVisibility: () -> Unit,
    errorMessage: String? = null,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    modifier: Modifier = Modifier
) {
    val isError = errorMessage != null

    Column(modifier = modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            placeholder = {
                Text(
                    text = "Password",
                    color = SecondaryText.copy(alpha = 0.6f),
                    fontSize = 15.sp
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Lock,
                    contentDescription = null,
                    tint = if (isError) ErrorColor else EmeraldGreen.copy(alpha = 0.8f),
                    modifier = Modifier.size(20.dp)
                )
            },
            trailingIcon = {
                IconButton(onClick = onToggleVisibility) {
                    Icon(
                        imageVector = if (isPasswordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                        contentDescription = if (isPasswordVisible) "Hide password" else "Show password",
                        tint = SecondaryText.copy(alpha = 0.8f),
                        modifier = Modifier.size(20.dp)
                    )
                }
            },
            visualTransformation = if (isPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
            isError = isError,
            singleLine = true,
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Password,
                imeAction = ImeAction.Done
            ),
            keyboardActions = keyboardActions,
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = InputBackground,
                unfocusedContainerColor = InputBackground,
                errorContainerColor = InputBackground,
                focusedBorderColor = EmeraldGreen,
                unfocusedBorderColor = InputBorder,
                errorBorderColor = ErrorColor,
                focusedTextColor = PrimaryText,
                unfocusedTextColor = PrimaryText,
                cursorColor = EmeraldGreen
            )
        )

        if (isError) {
            Text(
                text = errorMessage.orEmpty(),
                color = ErrorColor,
                style = MaterialTheme.typography.bodyMedium,
                fontSize = 12.sp,
                modifier = Modifier.padding(start = 14.dp, top = 4.dp)
            )
        }
    }
}

/**
 * Section F: Remember Me Checkbox & Forgot Password Action Row
 */
@Composable
fun RememberMeRow(
    rememberMe: Boolean,
    onRememberMeChange: (Boolean) -> Unit,
    onForgotPasswordClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Left: Remember me Checkbox
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .clickable { onRememberMeChange(!rememberMe) }
                .padding(vertical = 4.dp, horizontal = 2.dp)
        ) {
            Checkbox(
                checked = rememberMe,
                onCheckedChange = onRememberMeChange,
                colors = CheckboxDefaults.colors(
                    checkedColor = EmeraldGreen,
                    uncheckedColor = InputBorder,
                    checkmarkColor = DeepEmeraldBlack
                ),
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Remember me",
                style = MaterialTheme.typography.bodyMedium,
                color = SecondaryText,
                fontSize = 13.sp
            )
        }

        // Right: Forgot Password Action
        Text(
            text = "Forgot password?",
            color = LuxuryGold,
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.SemiBold,
            fontSize = 13.sp,
            modifier = Modifier
                .clip(RoundedCornerShape(6.dp))
                .clickable(onClick = onForgotPasswordClick)
                .padding(vertical = 4.dp, horizontal = 4.dp)
        )
    }
}

/**
 * Section G: Primary Sign In Button
 * Gold gradient treatment with high-contrast text and tactile feedback.
 */
@Composable
fun SignInButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .height(54.dp),
        shape = RoundedCornerShape(16.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent
        ),
        contentPadding = PaddingValues()
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    brush = GoldGradientBrush,
                    shape = RoundedCornerShape(16.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Sign In",
                color = DeepEmeraldBlack,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
        }
    }
}

/**
 * Section H: Biometric Sign-in Preview
 * Subtle divider and elegant emerald circular container.
 */
@Composable
fun BiometricSignInOption(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Divider with "OR"
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            HorizontalDivider(
                modifier = Modifier.weight(1f),
                color = InputBorder.copy(alpha = 0.6f)
            )
            Text(
                text = "OR",
                color = SecondaryText.copy(alpha = 0.7f),
                style = MaterialTheme.typography.bodyMedium,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(horizontal = 14.dp)
            )
            HorizontalDivider(
                modifier = Modifier.weight(1f),
                color = InputBorder.copy(alpha = 0.6f)
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Biometric Button / Container
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .clickable(onClick = onClick),
            shape = RoundedCornerShape(16.dp),
            color = DarkEmerald.copy(alpha = 0.5f),
            border = androidx.compose.foundation.BorderStroke(1.dp, InputBorder)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp, horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Circular emerald container for fingerprint icon
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(DarkEmerald)
                        .border(1.dp, EmeraldGreen.copy(alpha = 0.35f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Fingerprint,
                        contentDescription = "Biometric Icon",
                        tint = EmeraldGreen,
                        modifier = Modifier.size(24.dp)
                    )
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column {
                    Text(
                        text = "Sign in with Biometrics",
                        color = PrimaryText,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 14.sp
                    )
                    Text(
                        text = "Use your fingerprint or device biometrics.",
                        color = SecondaryText,
                        style = MaterialTheme.typography.bodyMedium,
                        fontSize = 12.sp
                    )
                }
            }
        }
    }
}

/**
 * Section I: Registration Navigation Footer
 */
@Composable
fun CreateAccountFooter(
    onCreateAccountClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Don't have an account?",
            style = MaterialTheme.typography.bodyMedium,
            color = SecondaryText,
            fontSize = 14.sp
        )
        Spacer(modifier = Modifier.width(6.dp))
        Box(
            modifier = Modifier
                .heightIn(min = 44.dp)
                .clip(RoundedCornerShape(6.dp))
                .clickable(onClick = onCreateAccountClick)
                .padding(horizontal = 8.dp, vertical = 10.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Create Account",
                style = MaterialTheme.typography.bodyMedium,
                color = LuxuryGold,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF03120E)
@Composable
fun SignInScreenPreview() {
    NineNinePayTheme {
        SignInScreen()
    }
}
