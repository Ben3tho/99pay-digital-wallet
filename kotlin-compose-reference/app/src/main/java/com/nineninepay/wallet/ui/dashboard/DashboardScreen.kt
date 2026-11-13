package com.nineninepay.wallet.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nineninepay.wallet.ui.theme.*

/**
 * 99Pay Digital Wallet - Tanzanian Digital Card & ID Organizer Dashboard
 * Non-custodial, BoT-aligned encrypted local vault
 */
@Composable
fun DashboardScreen(
    onSignOut: () -> Unit = {},
    onAddNewItem: () -> Unit = {}
) {
    var selectedCategory by remember { mutableStateOf("All") }
    var searchQuery by remember { mutableStateOf("") }

    val categories = listOf("All", "Bank Cards", "Mobile Money", "National IDs", "NHIF")

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepEmeraldBlack)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(12.dp))

            // 1. Header with Avatar and Lock Action
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(DarkEmerald, DeepEmeraldBlack)
                                )
                            )
                            .border(1.dp, EmeraldGreen.copy(alpha = 0.4f), RoundedCornerShape(14.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "JB",
                            color = LuxuryGold,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    }

                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Habari, Joseph",
                                color = TextPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(DarkEmerald)
                                    .border(1.dp, EmeraldGreen.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "Vault Active",
                                    color = EmeraldGreen,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                        Text(
                            text = "One App. All Your Cards.",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                    }
                }

                IconButton(
                    onClick = onSignOut,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(InputBackground)
                        .border(1.dp, InputBorder, RoundedCornerShape(12.dp))
                ) {
                    Icon(
                        imageVector = Icons.Outlined.Lock,
                        contentDescription = "Lock Wallet",
                        tint = ErrorRed,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // 2. Vault Summary Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = DarkEmerald),
                border = androidx.compose.foundation.BorderStroke(1.dp, InputBorder),
                shape = RoundedCornerShape(20.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "99Pay Secure Vault",
                                color = TextSecondary,
                                fontSize = 12.sp
                            )
                            Text(
                                text = "8 Documents & Cards",
                                color = TextPrimary,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black
                            )
                        }

                        Button(
                            onClick = onAddNewItem,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = LuxuryGold,
                                contentColor = DeepEmeraldBlack
                            ),
                            shape = RoundedCornerShape(12.dp),
                            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Icon(Icons.Filled.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "Add Item", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        VaultCounter("2 Banks", LuxuryGold)
                        VaultCounter("3 Mobile", EmeraldGreen)
                        VaultCounter("2 IDs", TextPrimary)
                        VaultCounter("1 NHIF", EmeraldGreen)
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // 3. Category Filter Chips (Row)
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                contentPadding = PaddingValues(vertical = 4.dp)
            ) {
                items(categories) { category ->
                    val isSelected = category == selectedCategory
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedCategory = category },
                        label = {
                            Text(
                                text = category,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                fontSize = 12.sp
                            )
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = EmeraldGreen,
                            selectedLabelColor = DeepEmeraldBlack,
                            containerColor = InputBackground,
                            labelColor = TextSecondary
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true,
                            selected = isSelected,
                            borderColor = if (isSelected) EmeraldGreen else InputBorder
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // 4. Content List
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(bottom = 24.dp)
            ) {
                if (selectedCategory == "All" || selectedCategory == "Bank Cards") {
                    item {
                        BankCardComposable(
                            bankName = "CRDB Bank",
                            tier = "Tanzanite Platinum",
                            cardType = "VISA",
                            maskedNumber = "4192 •••• •••• 4821",
                            cardholder = "JOSEPH B. MLAY",
                            expiry = "08/28",
                            gradient = listOf(DarkEmerald, DeepEmeraldBlack)
                        )
                    }
                    item {
                        BankCardComposable(
                            bankName = "NMB Bank",
                            tier = "Gold Debit",
                            cardType = "MASTERCARD",
                            maskedNumber = "5399 •••• •••• 9104",
                            cardholder = "JOSEPH B. MLAY",
                            expiry = "11/27",
                            gradient = listOf(Color(0xFF2E2305), Color(0xFF171203))
                        )
                    }
                }

                if (selectedCategory == "All" || selectedCategory == "Mobile Money") {
                    item {
                        MobileMoneyComposable(
                            provider = "Vodacom M-Pesa",
                            accountHolder = "Joseph Benedicto Mlay",
                            phoneNumber = "+255 744 890 123",
                            ussdCode = "*150*00#"
                        )
                    }
                    item {
                        MobileMoneyComposable(
                            provider = "Tigo Pesa",
                            accountHolder = "Joseph Benedicto Mlay",
                            phoneNumber = "+255 712 345 678",
                            ussdCode = "*150*01#"
                        )
                    }
                }

                if (selectedCategory == "All" || selectedCategory == "National IDs") {
                    item {
                        IdentityComposable(
                            docType = "NIDA National ID",
                            number = "19920815-14102-00001-26",
                            name = "JOSEPH BENEDICTO MLAY",
                            authority = "National Identification Authority (NIDA)"
                        )
                    }
                }

                if (selectedCategory == "All" || selectedCategory == "NHIF") {
                    item {
                        InsuranceComposable(
                            provider = "NHIF",
                            scheme = "Bima ya Afya kwa Wote",
                            membership = "10-2948194-0",
                            member = "JOSEPH BENEDICTO MLAY"
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun VaultCounter(label: String, color: Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(DeepEmeraldBlack.copy(alpha = 0.6f))
            .border(1.dp, InputBorder.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(text = label, color = color, fontSize = 11.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun BankCardComposable(
    bankName: String,
    tier: String,
    cardType: String,
    maskedNumber: String,
    cardholder: String,
    expiry: String,
    gradient: List<Color>
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(180.dp),
        shape = RoundedCornerShape(24.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, EmeraldGreen.copy(alpha = 0.35f))
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Brush.linearGradient(gradient))
                .padding(18.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = bankName, color = TextPrimary, fontWeight = FontWeight.Black, fontSize = 16.sp)
                        Text(text = tier, color = LuxuryGold, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    }
                    Text(text = cardType, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                }

                Text(
                    text = maskedNumber,
                    color = TextPrimary,
                    fontSize = 18.sp,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 2.sp,
                    fontWeight = FontWeight.Bold
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(text = cardholder, color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Medium)
                    Text(text = expiry, color = TextPrimary, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                }
            }
        }
    }
}

@Composable
fun MobileMoneyComposable(
    provider: String,
    accountHolder: String,
    phoneNumber: String,
    ussdCode: String
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = InputBackground),
        border = androidx.compose.foundation.BorderStroke(1.dp, InputBorder)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = provider, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(text = ussdCode, color = LuxuryGold, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = accountHolder, color = TextSecondary, fontSize = 12.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = phoneNumber, color = TextPrimary, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, fontFamily = FontFamily.Monospace)
        }
    }
}

@Composable
fun IdentityComposable(
    docType: String,
    number: String,
    name: String,
    authority: String
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = DarkEmerald.copy(alpha = 0.7f)),
        border = androidx.compose.foundation.BorderStroke(1.dp, InputBorder)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = docType, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(text = "Encrypted", color = EmeraldGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = number, color = LuxuryGold, fontSize = 15.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = name, color = TextSecondary, fontSize = 12.sp)
        }
    }
}

@Composable
fun InsuranceComposable(
    provider: String,
    scheme: String,
    membership: String,
    member: String
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = InputBackground),
        border = androidx.compose.foundation.BorderStroke(1.dp, InputBorder)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = provider, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(text = "Active Cover", color = EmeraldGreen, fontSize = 10.sp)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = membership, color = LuxuryGold, fontSize = 15.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = member, color = TextSecondary, fontSize = 12.sp)
        }
    }
}
