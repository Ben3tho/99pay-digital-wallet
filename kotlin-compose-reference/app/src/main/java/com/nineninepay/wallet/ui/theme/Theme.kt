package com.nineninepay.wallet.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = EmeraldGreen,
    onPrimary = DeepEmeraldBlack,
    secondary = LuxuryGold,
    onSecondary = DeepEmeraldBlack,
    tertiary = LuxuryGoldLight,
    background = DeepEmeraldBlack,
    onBackground = PrimaryText,
    surface = DarkEmerald,
    onSurface = PrimaryText,
    surfaceVariant = InputBackground,
    onSurfaceVariant = SecondaryText,
    outline = InputBorder,
    error = ErrorColor,
    onError = Color.White
)

@Composable
fun NineNinePayTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    // 99Pay defaults to its signature Deep Emerald Black palette
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
