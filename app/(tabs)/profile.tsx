import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ProfileFormSchema,
  type ProfileFormData,
} from "@/schemas/profile.schema";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LANGUAGES = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
] as const;

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}

function SettingRow({ icon, label, value, right, onPress }: SettingRowProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress && !right}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View
        style={[styles.rowIconWrap, { backgroundColor: colors.background }]}
      >
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      {value && (
        <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
          {value}
        </Text>
      )}
      {right ??
        (onPress && (
          <Ionicons name="chevron-forward" size={18} color={colors.gray} />
        ))}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  // Zustand stores
  const {
    isDark,
    toggleTheme,
    language,
    setLanguage,
    notifications,
    setNotifications,
  } = useSettingsStore();
  const { firstName, lastName, email, avatarUri, setProfile, setAvatar } =
    useUserStore();

  // React Hook Form + Zod
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: { firstName, lastName, email },
  });

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const onSaveProfile = (data: ProfileFormData) => {
    setProfile(data);
    setEditMode(false);
    Alert.alert(t.success, t.profileUpdated);
  };

  const handlePrivacy = () => {
    Alert.alert(t.privacy, t.privacyMessage);
  };

  const handleHelp = () => {
    Alert.alert(t.help, t.helpMessage);
  };

  const handleAbout = () => {
    Alert.alert(t.about, t.aboutMessage);
  };

  const handleLogout = () => {
    Alert.alert(t.logoutTitle, t.logoutConfirm, [
      { text: t.cancel, style: "cancel" },
      { text: t.logout, style: "destructive", onPress: () => {} },
    ]);
  };

  const displayName =
    firstName && lastName ? `${firstName} ${lastName}` : t.user;
  const displayEmail = email || "kullanici@email.com";
  const currentLangObj =
    LANGUAGES.find((l) => l.label === language) ?? LANGUAGES[0];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Profil Başlık */}
      <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={pickAvatar} activeOpacity={0.7}>
          <View style={[styles.avatarContainer]}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View
                style={[
                  styles.avatarFallback,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="person" size={36} color="#FFF" />
              </View>
            )}
            <View
              style={[
                styles.cameraIcon,
                { backgroundColor: colors.primary, borderColor: colors.card },
              ]}
            >
              <Ionicons name="camera" size={12} color="#FFF" />
            </View>
          </View>
        </TouchableOpacity>

        {editMode ? (
          <View style={styles.editForm}>
            {(["firstName", "lastName", "email"] as const).map((field) => (
              <Controller
                key={field}
                control={control}
                name={field}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.fieldGroup}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {field === "firstName"
                        ? t.firstName
                        : field === "lastName"
                          ? t.lastName
                          : t.emailLabel}
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.background,
                          borderColor: errors[field]
                            ? colors.danger
                            : colors.border,
                          color: colors.text,
                        },
                      ]}
                      placeholder={
                        field === "firstName"
                          ? t.firstNamePlaceholder
                          : field === "lastName"
                            ? t.lastNamePlaceholder
                            : t.emailPlaceholder
                      }
                      placeholderTextColor={colors.gray}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType={
                        field === "email" ? "email-address" : "default"
                      }
                      autoCapitalize={field === "email" ? "none" : "words"}
                    />
                    {errors[field] && (
                      <Text
                        style={[styles.errorText, { color: colors.danger }]}
                      >
                        {errors[field]?.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            ))}

            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[
                  styles.editSaveButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleSubmit(onSaveProfile)}
                disabled={isSubmitting}
              >
                <Ionicons name="checkmark" size={18} color="#FFF" />
                <Text style={styles.editSaveText}>{t.save}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.editCancelButton,
                  { borderColor: colors.border },
                ]}
                onPress={() => {
                  reset({ firstName, lastName, email });
                  setEditMode(false);
                }}
              >
                <Text
                  style={[
                    styles.editCancelText,
                    { color: colors.textSecondary },
                  ]}
                >
                  İptal
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Text style={[styles.userName, { color: colors.text }]}>
              {displayName}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {displayEmail}
            </Text>
            <TouchableOpacity
              style={[styles.editProfileBtn, { borderColor: colors.primary }]}
              onPress={() => setEditMode(true)}
            >
              <Ionicons
                name="create-outline"
                size={14}
                color={colors.primary}
              />
              <Text style={[styles.editProfileText, { color: colors.primary }]}>
                {t.editProfile}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Görünüm */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.appearance}
        </Text>
        <SettingRow
          icon="moon-outline"
          label={t.darkMode}
          right={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.grayLight, true: colors.primary }}
            />
          }
        />
        <SettingRow
          icon="language-outline"
          label={t.language}
          value={`${currentLangObj.flag} ${currentLangObj.label}`}
          onPress={() => setLangModalVisible(true)}
        />
      </View>

      {/* Hesap */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.account}
        </Text>
        <SettingRow
          icon="notifications-outline"
          label={t.notifications}
          right={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.grayLight, true: colors.primary }}
            />
          }
        />
        <SettingRow
          icon="shield-outline"
          label={t.privacy}
          onPress={handlePrivacy}
        />
      </View>

      {/* Diğer */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t.other}
        </Text>
        <SettingRow
          icon="help-circle-outline"
          label={t.help}
          onPress={handleHelp}
        />
        <SettingRow
          icon="information-circle-outline"
          label={t.about}
          onPress={handleAbout}
        />
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.danger }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#FFF" />
        <Text style={styles.logoutText}>{t.logout}</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />

      {/* Dil Seçim Modalı */}
      <Modal
        visible={langModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setLangModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLangModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t.selectLanguage}
            </Text>
            <Text
              style={[styles.modalSubtitle, { color: colors.textSecondary }]}
            >
              {t.changeLanguage}
            </Text>

            {LANGUAGES.map((lang) => {
              const isActive = language === lang.label;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langOption,
                    {
                      backgroundColor: isActive
                        ? `${colors.primary}15`
                        : "transparent",
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    setLanguage(lang.label);
                    setLangModalVisible(false);
                  }}
                  activeOpacity={0.6}
                >
                  <Text style={styles.langFlag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.langLabel,
                      {
                        color: isActive ? colors.primary : colors.text,
                        fontWeight: isActive ? "700" : "500",
                      },
                    ]}
                  >
                    {lang.label}
                  </Text>
                  {isActive && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 28,
    marginBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 14,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  userEmail: {
    fontSize: 14,
    marginTop: 3,
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 13,
    fontWeight: "600",
  },
  editForm: {
    width: "100%",
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 4,
  },
  fieldGroup: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
  },
  editButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  editSaveButton: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  editSaveText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  editCancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  editCancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
  section: {
    marginBottom: 12,
    marginHorizontal: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    paddingTop: 14,
    paddingBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  rowIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  rowValue: {
    fontSize: 14,
    marginRight: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  /* Language modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CCC",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 18,
  },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  langFlag: {
    fontSize: 22,
  },
  langLabel: {
    flex: 1,
    fontSize: 16,
  },
});
