import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Link, router } from "expo-router";

const WelcomeScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to {"\n"}StarCy</Text>
            <Text style={styles.subtitle}>
                This official app is free, syncs your history across devices,
                and brings you the latest emotional chat improvements.
            </Text>

            <View style={styles.section}>
                <Icon
                    name="glasses-outline"
                    size={24}
                    color="black"
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.sectionTitle}>
                        Chats feel super human-like
                    </Text>
                    <Text style={styles.sectionText}>
                        StarCy may provide incredibly natural responses, but
                        they might not always be 100% accurate about people,
                        places, or facts.
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Icon
                    name="lock-closed-outline"
                    size={24}
                    color="black"
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.sectionTitle}>Keep it personal</Text>
                    <Text style={styles.sectionText}>
                        You can share sensitive info if thats what you want.
                        Your chats are private, secure, and never reviewed or
                        used to train our models unless you opt in.
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Icon
                    name="settings-outline"
                    size={24}
                    color="black"
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.sectionTitle}>
                        Just Say "Hey StarCy" to Talk
                    </Text>
                    <Text style={styles.sectionText}>
                        Start chatting anytime by saying “Hey StarCy”—your
                        friendly AI is always ready to listen and chat,
                        hands-free!
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    router.push("/setting");
                }}
            >
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 18,
        color: "gray",
        textAlign: "left",
        marginBottom: 25,
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
        width: "100%",
    },
    icon: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    sectionText: {
        fontSize: 16,
        color: "gray",
    },
    button: {
        backgroundColor: "black",
        paddingVertical: 18,
        borderRadius: 50,
        alignItems: "center",
        width: "100%",
        marginTop: 30,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
