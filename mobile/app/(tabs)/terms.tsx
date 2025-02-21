import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";

export default function TermsScreen() {
    const router = useRouter();
    const [isChecked, setIsChecked] = useState(false); // Checkbox state

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>Welcome to StarCy</Text>

                    {/* Warning Section */}
                    <View style={styles.section}>
                        <Ionicons name="flag-outline" size={24} color="black" />
                        <View style={styles.textContainer}>
                            <Text>
                                StarCy may provide inaccurate information about
                                people, places, or facts. - Keep it personal:
                                Don’t share sensitive info. Your chats are
                                private, secure, and never used to train our
                                models unless you say so.
                            </Text>
                        </View>
                    </View>

                    {/* Privacy Section */}
                    <View style={styles.section}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={24}
                            color="black"
                        />
                        <View style={styles.textContainer}>
                            <Text>
                                StarCy is your Artificially Intelligent friend
                                that chats like a human and helps with your
                                daily moments. - Responses can be inaccurate:
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <View>
                    {/* Terms & Privacy Policy */}
                    <Text style={styles.footerText}>
                        By continuing, you agree to our{" "}
                        <Text style={styles.boldText}>Terms</Text> and have read
                        our <Text style={styles.boldText}>Privacy Policy</Text>.
                    </Text>

                    {/* Checkbox Agreement */}
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            value={isChecked}
                            onValueChange={setIsChecked}
                            color={isChecked ? "black" : undefined}
                            style={styles.checkbox}
                        />
                        <Text style={styles.checkboxLabel}>
                            I accept the Terms & Privacy Policy
                        </Text>
                    </View>
                    {/* Continue Button */}
                    <TouchableOpacity
                        style={[
                            styles.button,
                            !isChecked && styles.disabledButton,
                        ]}
                        onPress={() => router.push("/welcome")}
                        disabled={!isChecked}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

// Styles
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-between",
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 40,
    },
    description: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    boldText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    lightText: {
        fontSize: 14,
        color: "#666",
    },
    learnMore: {
        color: "#000",
        fontWeight: "bold",
    },
    footerText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginVertical: 20,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    checkbox: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    checkboxLabel: {
        fontSize: 14,
        color: "#333",
    },
    button: {
        backgroundColor: "black",
        padding: 15,
        alignItems: "center",
        borderRadius: 5,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
