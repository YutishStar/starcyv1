import { router } from "expo-router";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Setting: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/* ACCOUNT Section */}
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.sectionContainer}>
                <View style={styles.settingRow}>
                    <View style={styles.labelContainer}>
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color="#333"
                            style={styles.icon}
                        />
                        <Text style={styles.settingLabel}>Email</Text>
                    </View>
                    <Text style={styles.settingValue}>
                        haopeng138@gmail.com
                    </Text>
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.labelContainer}>
                        <Ionicons
                            name="call-outline"
                            size={20}
                            color="#333"
                            style={styles.icon}
                        />
                        <Text style={styles.settingLabel}>Phone number</Text>
                    </View>
                    <Text style={styles.settingValue}>+xxxxxx</Text>
                </View>

                <View style={[styles.settingRow, styles.lastSettingRow]}>
                    <View style={styles.labelContainer}>
                        <Ionicons
                            name="card-outline"
                            size={20}
                            color="#333"
                            style={styles.icon}
                        />
                        <Text style={styles.settingLabel}>Subscription</Text>
                    </View>
                    <Text style={styles.settingValue}>Free Plan</Text>
                </View>

                <TouchableOpacity style={styles.settingRow}>
                    <View style={styles.labelContainer}>
                        <Ionicons
                            name="arrow-up-circle-outline"
                            size={20}
                            color="#333"
                            style={styles.icon}
                        />
                        <Text style={styles.settingLabel}>Upgrade to Plus</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.settingRow, styles.lastSettingRow]}
                >
                    <View style={styles.labelContainer}>
                        <Ionicons
                            name="reload-circle-outline"
                            size={20}
                            color="#333"
                            style={styles.icon}
                        />
                        <Text style={styles.settingLabel}>
                            Restore purchases
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* ABOUT Section */}
            <Text style={styles.sectionTitle}>ABOUT</Text>
            <View style={styles.sectionContainer}>
                <TouchableOpacity style={styles.settingRow}>
                    <View style={styles.labelContainer}>
                        <Ionicons
                            name="help-circle-outline"
                            size={20}
                            color="#333"
                            style={styles.icon}
                        />
                        <Text style={styles.settingLabel}>Help Center</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingRow}>
                    <View style={styles.labelContainer}>
                        <Ionicons
                            name="document-text-outline"
                            size={20}
                            color="#333"
                            style={styles.icon}
                        />
                        <Text style={styles.settingLabel}>Terms of Use</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingRow}>
                    <View style={styles.labelContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="#333"
                            style={styles.icon}
                        />
                        <Text style={styles.settingLabel}>Privacy Policy</Text>
                    </View>
                </TouchableOpacity>

                <View style={[styles.settingRow, styles.lastSettingRow]}>
                    <View style={styles.labelContainer}>
                        <Ionicons
                            name="logo-apple"
                            size={20}
                            color="#333"
                            style={styles.icon}
                        />
                        <Text style={styles.settingLabel}>ChatGPT for iOS</Text>
                    </View>
                    <Text style={styles.settingValue}>
                        1.2025.036 (163284436)
                    </Text>
                </View>
            </View>

            {/* Go back */}
            <View style={styles.sectionContainer}>
                <TouchableOpacity
                    style={[styles.settingRow, styles.lastSettingRow]}
                >
                    <Text
                        style={styles.settingLabel}
                        onPress={() => router.push("/")}
                    >
                        Go back to Home
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    sectionContainer: {
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#333",
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 10,
    },
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    lastSettingRow: {
        borderBottomWidth: 0,
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    settingLabel: {
        fontSize: 16,
        color: "#333",
        marginLeft: 8,
    },
    settingValue: {
        fontSize: 16,
        color: "#666",
    },
    icon: {
        // Optional: add additional styling for the icons if needed
    },
});

export default Setting;
