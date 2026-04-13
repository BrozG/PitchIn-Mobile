import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, Paperclip, X, User, DollarSign, Target } from 'lucide-react-native';

const MatchRequestScreen = ({ navigation, route }) => {
  const founder = route?.params?.founder || {
    companyName: 'TechStart Inc',
    industry: 'Fintech',
    amountRaising: 500000,
  };
  const investorTier = route?.params?.tier || 'free'; // free, connector, partner

  const [note, setNote] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = investorTier === 'free' ? 150 : 1000;
  const [attachedFile, setAttachedFile] = useState(null);

  const handleSend = () => {
    if (note.trim().length === 0) {
      Alert.alert('Empty Note', 'Please write a note to the founder.');
      return;
    }
    Alert.alert(
      'Match Request Sent',
      `Your request has been sent to ${founder.companyName}. They will respond within 7 days.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleAttach = () => {
    // Simulate file picker
    Alert.alert('Attach File', 'PDF, images, Excel up to 50MB', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Simulate Attach', onPress: () => setAttachedFile({ name: 'pitch_deck.pdf', size: '2.4 MB' }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <X size={24} color="#8A94A6" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Request Match</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Founder Card Preview */}
          <View style={styles.founderCard}>
            <View style={styles.founderHeader}>
              <User size={24} color="#C9A84C" />
              <Text style={styles.founderName}>{founder.companyName}</Text>
            </View>
            <View style={styles.founderDetails}>
              <View style={styles.detailRow}>
                <Target size={16} color="#8A94A6" />
                <Text style={styles.detailText}>{founder.industry}</Text>
              </View>
              <View style={styles.detailRow}>
                <DollarSign size={16} color="#8A94A6" />
                <Text style={styles.detailText}>${founder.amountRaising.toLocaleString()} raising</Text>
              </View>
            </View>
          </View>

          {/* Note Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>
              Your Introduction {investorTier === 'free' && '(150 char limit)'}
            </Text>
            <TextInput
              style={[styles.textInput, note.length > maxChars && styles.inputError]}
              placeholder={`Introduce yourself, why you're interested, and what you can offer...`}
              placeholderTextColor="#4A5568"
              multiline
              numberOfLines={6}
              maxLength={maxChars}
              value={note}
              onChangeText={(text) => {
                setNote(text);
                setCharCount(text.length);
              }}
            />
            <View style={styles.charCounter}>
              <Text style={[styles.charText, charCount > maxChars && styles.charError]}>
                {charCount}/{maxChars}
              </Text>
              {investorTier === 'free' && (
                <Text style={styles.upgradeHint}>
                  Upgrade to Connector for unlimited characters & file attachments
                </Text>
              )}
            </View>
          </View>

          {/* File Attachment */}
          {investorTier !== 'free' && (
            <View style={styles.attachmentSection}>
              <Text style={styles.sectionTitle}>Attach File (Optional)</Text>
              <TouchableOpacity style={styles.attachButton} onPress={handleAttach}>
                <Paperclip size={20} color="#C9A84C" />
                <Text style={styles.attachButtonText}>Attach PDF, Image, Excel</Text>
              </TouchableOpacity>
              {attachedFile && (
                <View style={styles.attachedFile}>
                  <Text style={styles.fileName}>{attachedFile.name}</Text>
                  <Text style={styles.fileSize}>{attachedFile.size}</Text>
                  <TouchableOpacity onPress={() => setAttachedFile(null)}>
                    <X size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips for a successful match</Text>
            <Text style={styles.tip}>• Mention specific aspects of their business you admire</Text>
            <Text style={styles.tip}>• State your check size and typical involvement</Text>
            <Text style={styles.tip}>• Keep it professional but personable</Text>
            <Text style={styles.tip}>• Free tier users: be concise (150 chars)</Text>
          </View>
        </ScrollView>

        {/* Send Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Send size={20} color="#080C14" />
            <Text style={styles.sendButtonText}>Send Match Request</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C14',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
  },
  placeholder: {
    width: 40,
  },
  founderCard: {
    backgroundColor: '#0F1623',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#1E2D45',
  },
  founderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  founderName: {
    fontSize: 24,
    color: '#F0F4FF',
    marginLeft: 12,
    fontFamily: 'ClashDisplay-Bold',
  },
  founderDetails: {
    marginLeft: 36,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#8A94A6',
    fontSize: 16,
    marginLeft: 10,
  },
  inputSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#F0F4FF',
    marginBottom: 12,
    fontFamily: 'ClashDisplay-Bold',
  },
  textInput: {
    backgroundColor: '#0F1623',
    borderWidth: 1,
    borderColor: '#1E2D45',
    borderRadius: 16,
    padding: 20,
    color: '#F0F4FF',
    fontSize: 16,
    minHeight: 180,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  charCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  charText: {
    color: '#8A94A6',
    fontSize: 14,
  },
  charError: {
    color: '#EF4444',
  },
  upgradeHint: {
    color: '#C9A84C',
    fontSize: 12,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  attachmentSection: {
    marginBottom: 32,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1623',
    borderWidth: 1,
    borderColor: '#1E2D45',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
  },
  attachButtonText: {
    color: '#C9A84C',
    fontSize: 16,
    marginLeft: 12,
  },
  attachedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2433',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    justifyContent: 'space-between',
  },
  fileName: {
    color: '#F0F4FF',
    fontSize: 16,
  },
  fileSize: {
    color: '#8A94A6',
    fontSize: 14,
  },
  tipsSection: {
    backgroundColor: '#0F1623',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E2D45',
  },
  tipsTitle: {
    color: '#C9A84C',
    fontSize: 18,
    marginBottom: 12,
    fontWeight: '600',
  },
  tip: {
    color: '#8A94A6',
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#080C14',
    borderTopWidth: 1,
    borderTopColor: '#1E2D45',
    padding: 24,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C9A84C',
    borderRadius: 16,
    paddingVertical: 20,
  },
  sendButtonText: {
    color: '#080C14',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

export default MatchRequestScreen;