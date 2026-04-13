import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Send, Paperclip, File, User, ChevronRight, CheckCircle, Clock, XCircle } from 'lottie-react-native';

const { width } = Dimensions.get('window');

const DealRoomScreen = ({ navigation, route }) => {
  const deal = route?.params?.deal || {
    id: '1',
    founderName: 'Alex Johnson',
    company: 'TechStart Inc',
    stage: 'due_diligence',
    lastActivity: '2 hours ago',
  };

  const [messages, setMessages] = useState([
    { id: '1', sender: 'founder', text: 'Thanks for connecting! Here’s our pitch deck.', time: '10:30 AM', file: { name: 'pitch_deck.pdf', size: '2.4 MB' } },
    { id: '2', sender: 'investor', text: 'Looks promising. Can you share your cap table?', time: '10:42 AM' },
    { id: '3', sender: 'founder', text: 'Sure, attaching it now.', time: '11:15 AM', file: { name: 'cap_table.xlsx', size: '1.1 MB' } },
    { id: '4', sender: 'investor', text: 'Got it. Let’s schedule a call next week.', time: '11:30 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const stages = [
    { key: 'intro', label: 'Intro' },
    { key: 'due_diligence', label: 'Due Diligence' },
    { key: 'term_sheet', label: 'Term Sheet' },
    { key: 'closed', label: 'Closed' },
    { key: 'passed', label: 'Passed' },
  ];

  const currentStageIndex = stages.findIndex(s => s.key === deal.stage);

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'investor',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
    setInputText('');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const advanceStage = () => {
    // In real app, update via API
    Alert.alert('Stage Updated', 'Deal stage advanced.');
  };

  const renderMessage = (msg) => {
    const isInvestor = msg.sender === 'investor';
    return (
      <View key={msg.id} style={[styles.messageRow, isInvestor ? styles.investorRow : styles.founderRow]}>
        <View style={[styles.avatar, { backgroundColor: isInvestor ? '#C9A84C' : '#2563EB' }]}>
          <User size={20} color="#080C14" />
        </View>
        <View style={[styles.messageBubble, isInvestor ? styles.investorBubble : styles.founderBubble]}>
          <Text style={styles.messageText}>{msg.text}</Text>
          {msg.file && (
            <TouchableOpacity style={styles.fileAttachment}>
              <File size={16} color={isInvestor ? '#080C14' : '#F0F4FF'} />
              <Text style={[styles.fileName, { color: isInvestor ? '#080C14' : '#F0F4FF' }]}>{msg.file.name}</Text>
              <Text style={[styles.fileSize, { color: isInvestor ? '#080C14' : '#F0F4FF' }]}>{msg.file.size}</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.messageTime, { color: isInvestor ? '#080C14' : '#8A94A6' }]}>{msg.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronRight size={24} color="#8A94A6" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{deal.company}</Text>
          <Text style={styles.headerSubtitle}>Deal Room • {deal.founderName}</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Deal Stage Tracker */}
      <View style={styles.stageTracker}>
        <View style={styles.stageBar}>
          {stages.map((stage, index) => (
            <React.Fragment key={stage.key}>
              <TouchableOpacity
                style={[
                  styles.stageDot,
                  index <= currentStageIndex ? styles.stageDotActive : styles.stageDotInactive,
                  index === currentStageIndex && styles.stageDotCurrent,
                ]}
                onPress={() => navigation.setParams({ ...deal, stage: stage.key })}
              >
                {index < currentStageIndex ? (
                  <CheckCircle size={16} color="#080C14" />
                ) : index === currentStageIndex ? (
                  <Clock size={16} color="#080C14" />
                ) : null}
              </TouchableOpacity>
              {index < stages.length - 1 && (
                <View
                  style={[
                    styles.stageLine,
                    index < currentStageIndex ? styles.stageLineActive : styles.stageLineInactive,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.stageLabels}>
          {stages.map((stage) => (
            <Text
              key={stage.key}
              style={[
                styles.stageLabel,
                stage.key === deal.stage && styles.stageLabelCurrent,
              ]}
            >
              {stage.label}
            </Text>
          ))}
        </View>
        <TouchableOpacity style={styles.advanceButton} onPress={advanceStage}>
          <Text style={styles.advanceButtonText}>Advance Stage</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Info */}
      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>Contact Info</Text>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>Email:</Text>
          <Text style={styles.contactValue}>alex@techstart.com</Text>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>LinkedIn:</Text>
          <Text style={styles.contactValue}>linkedin.com/in/alexjohnson</Text>
        </View>
        <View style={styles.contactRow}>
          <Text style={styles.contactLabel}>Phone:</Text>
          <Text style={styles.contactValue}>+1 (555) 123‑4567</Text>
        </View>
        <Text style={styles.contactNote}>Contact info is only visible inside this Deal Room.</Text>
      </View>

      {/* Chat */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Paperclip size={24} color="#8A94A6" />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          placeholderTextColor="#8A94A6"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Send size={24} color="#080C14" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2D45',
  },
  backButton: {
    padding: 8,
    transform: [{ rotate: '180deg' }],
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8A94A6',
  },
  menuButton: {
    padding: 8,
  },
  menuText: {
    fontSize: 24,
    color: '#8A94A6',
  },
  stageTracker: {
    backgroundColor: '#0F1623',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E2D45',
  },
  stageBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stageDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageDotActive: {
    backgroundColor: '#C9A84C',
  },
  stageDotInactive: {
    backgroundColor: '#1E2D45',
  },
  stageDotCurrent: {
    borderWidth: 3,
    borderColor: '#FFD760',
  },
  stageLine: {
    flex: 1,
    height: 4,
    marginHorizontal: 4,
  },
  stageLineActive: {
    backgroundColor: '#C9A84C',
  },
  stageLineInactive: {
    backgroundColor: '#1E2D45',
  },
  stageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stageLabel: {
    fontSize: 12,
    color: '#8A94A6',
    textAlign: 'center',
    flex: 1,
  },
  stageLabelCurrent: {
    color: '#C9A84C',
    fontWeight: 'bold',
  },
  advanceButton: {
    backgroundColor: '#C9A84C',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  advanceButtonText: {
    color: '#080C14',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactCard: {
    backgroundColor: '#0F1623',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E2D45',
  },
  contactTitle: {
    fontSize: 20,
    color: '#F0F4FF',
    marginBottom: 16,
    fontFamily: 'ClashDisplay-Bold',
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  contactLabel: {
    width: 80,
    color: '#8A94A6',
    fontSize: 16,
  },
  contactValue: {
    flex: 1,
    color: '#F0F4FF',
    fontSize: 16,
  },
  contactNote: {
    color: '#8A94A6',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 12,
  },
  chatContainer: {
    flex: 1,
    marginTop: 20,
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  investorRow: {
    justifyContent: 'flex-end',
  },
  founderRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  messageBubble: {
    maxWidth: width * 0.7,
    padding: 16,
    borderRadius: 24,
    borderBottomLeftRadius: 4,
  },
  investorBubble: {
    backgroundColor: '#C9A84C',
    borderBottomRightRadius: 4,
  },
  founderBubble: {
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#080C14',
    marginBottom: 8,
  },
  fileAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  fileSize: {
    fontSize: 12,
    marginLeft: 8,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1E2D45',
    backgroundColor: '#080C14',
  },
  attachButton: {
    padding: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0F1623',
    borderWidth: 1,
    borderColor: '#1E2D45',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: '#F0F4FF',
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: '#C9A84C',
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default DealRoomScreen;