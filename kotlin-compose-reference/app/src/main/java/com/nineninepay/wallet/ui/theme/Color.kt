package com.nineninepay.wallet.ui.theme

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Brush

/**
 * 99Pay Brand Color Palette
 * Designed for Tanzanian Digital Wallet - Phase 1
 */
val DeepEmeraldBlack = Color(0xFF03120E)
val DarkEmerald = Color(0xFF06271D)
val EmeraldGreen = Color(0xFF00B887)
val EmeraldGreenDark = Color(0xFF008F68)
val LuxuryGold = Color(0xFFF4C95D)
val LuxuryGoldLight = Color(0xFFF8D978)
val LuxuryGoldDark = Color(0xFFE6A92D)

val PrimaryText = Color(0xFFFFFFFF)
val SecondaryText = Color(0xFFB7C8C1)
val InputBackground = Color(0xFF0B211B)
val InputBorder = Color(0xFF24473A)
val ErrorColor = Color(0xFFFF6B6B)

val GoldGradientBrush = Brush.horizontalGradient(
    colors = listOf(LuxuryGoldLight, LuxuryGoldDark)
)

val EmeraldSubtleGlowBrush = Brush.radialGradient(
    colors = listOf(
        EmeraldGreen.copy(alpha = 0.15f),
        Color.Transparent
    )
)
