import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const texts = [
    "StarCy",
    "Your First Artificially Intelligent Friend",
    "AI that feels Human",
    "Let's Talk.",
];

const typingSpeed = 100; // Speed of typing in ms
const deleteSpeed = 50; // Speed of deleting in ms
const pauseTime = 1000; // Pause time after full text is typed out

const LoginPage = ({ setLogin }: { setLogin: (value: boolean) => void }) => {
    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = texts[textIndex];

        if (!isDeleting && displayText.length < currentText.length) {
            // Typing effect
            const typingTimeout = setTimeout(() => {
                setDisplayText(
                    currentText.substring(0, displayText.length + 1)
                );
            }, typingSpeed);

            return () => clearTimeout(typingTimeout);
        } else if (!isDeleting && displayText.length === currentText.length) {
            // Pause after full text is typed
            const pauseTimeout = setTimeout(() => {
                setIsDeleting(true);
            }, pauseTime);

            return () => clearTimeout(pauseTimeout);
        } else if (isDeleting && displayText.length > 0) {
            // Deleting effect
            const deletingTimeout = setTimeout(() => {
                setDisplayText(
                    displayText.substring(0, displayText.length - 1)
                );
            }, deleteSpeed);

            return () => clearTimeout(deletingTimeout);
        } else if (isDeleting && displayText.length === 0) {
            // Move to next text
            setIsDeleting(false);
            setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
    }, [displayText, isDeleting, textIndex]);

    return (
        <View style={styles.container}>
            {/* Typing Text Effect */}
            <Text style={styles.title}>
                {displayText}{" "}
                <FontAwesome name="circle" size={20} color="black" />
            </Text>

            {/* Authentication Buttons */}
            <View style={styles.authContainer}>
                <TouchableOpacity style={[styles.button, styles.appleButton]}>
                    <FontAwesome name="apple" size={20} color="black" />
                    <Text style={styles.appleText}> Continue with Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.googleButton]}>
                    <FontAwesome name="google" size={20} color="white" />
                    <Text style={styles.googleText}> Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.signUpButton]}>
                    <Text style={styles.signUpText}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.loginButton]}
                    onPress={() => setLogin(true)}
                >
                    <Text style={styles.loginText}>Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    authContainer: {
        position: "absolute",
        bottom: 50,
        width: "100%",
        paddingHorizontal: 20,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
    },
    appleButton: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
    },
    appleText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
    },
    googleButton: {
        backgroundColor: "black",
    },
    googleText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    signUpButton: {
        backgroundColor: "#333",
    },
    signUpText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    loginButton: {
        borderWidth: 1,
        borderColor: "white",
        backgroundColor: "black",
    },
    loginText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default LoginPage;
