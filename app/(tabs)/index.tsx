import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView, StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// --- MOCK DATA ---
const summaryData = [
  { id: '1', title: 'Produtos', value: '10', icon: 'package', color: '#F3F4F6', iconColor: '#8B5CF6' },
  { id: '2', title: 'Alertas', value: '5', icon: 'alert-triangle', color: '#FEF2F2', iconColor: '#EF4444' },
  { id: '3', title: 'Categorias', value: '5', icon: 'grid', color: '#FEF9C3', iconColor: '#EAB308' },
  { id: '4', title: 'Em Estoque', value: 'R$ 856', icon: 'dollar-sign', color: '#ECFDF5', iconColor: '#10B981' },
];

const criticalAlerts = [
  { id: '1', name: 'Café Especial 250g', amount: '4/10' },
  { id: '2', name: 'Caneta Esferográfica', amount: '1/20' },
  { id: '3', name: 'Sabão em Pó 3kg', amount: '0/4' },
];

const recentProducts = [
  { id: '1', name: 'Café Especial', quantity: '4 un', status: 'Baixo' },
  { id: '2', name: 'Água Mineral', quantity: '48 un', status: 'Normal' },
  { id: '3', name: 'Arroz Branco', quantity: '15 cx', status: 'Normal' },
  { id: '4', name: 'Sabão em Pó', quantity: '0 cx', status: 'Sem estoque' },
];

// --- COMPONENTES AUXILIARES ---
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor, textColor;
  switch (status) {
    case 'Baixo': bgColor = '#FEF9C3'; textColor = '#D97706'; break;
    case 'Normal': bgColor = '#ECFDF5'; textColor = '#059669'; break;
    case 'Sem estoque': bgColor = '#FEF2F2'; textColor = '#DC2626'; break;
    default: bgColor = '#F3F4F6'; textColor = '#374151';
  }
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{status}</Text>
    </View>
  );
};

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  // --- HEADER DA FLATLIST ---
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      {/* Saudação e FAB */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.greeting}>Olá, João 👋</Text>
          <Text style={styles.subtitle}>Visão geral do estoque</Text>
        </View>
        <TouchableOpacity style={styles.fab}>
          <Feather name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* 4 Cards de resumo com .map() */}
      <View style={styles.grid}>
        {summaryData.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: item.color }]}>
            <Feather name={item.icon as any} size={20} color={item.iconColor} style={{ marginBottom: 8 }} />
            <Text style={styles.cardValue}>{item.value}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        ))}
      </View>

      {/* Alerta de estoque crítico */}
      <View style={styles.alertBox}>
        <Text style={styles.alertBoxTitle}>⚠️ Estoque crítico (5)</Text>
        {criticalAlerts.map(alert => (
          <View key={alert.id} style={styles.alertItemRow}>
            <Text style={styles.alertItemName}>{alert.name}</Text>
            <Text style={styles.alertItemValue}>{alert.amount}</Text>
          </View>
        ))}
        <TouchableOpacity>
          <Text style={styles.alertLink}>Ver todos →</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Produtos recentes</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <FlatList
        data={recentProducts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8B5CF6']} />
        }
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.productIconBg}>
              <Feather name="package" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productQuantity}>{item.quantity}</Text>
            </View>
            <StatusBadge status={item.status} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  listContent: { padding: 20 },
  headerContainer: { marginBottom: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280' },
  fab: { backgroundColor: '#8B5CF6', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  card: { width: '48%', padding: 16, borderRadius: 16, marginBottom: 15 },
  cardValue: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  cardTitle: { fontSize: 12, color: '#6B7280' },
  alertBox: { backgroundColor: '#FFF1F2', padding: 16, borderRadius: 16, marginBottom: 24 },
  alertBoxTitle: { fontSize: 16, fontWeight: 'bold', color: '#BE123C', marginBottom: 12 },
  alertItemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  alertItemName: { fontSize: 14, color: '#4C1D95' },
  alertItemValue: { fontSize: 14, fontWeight: 'bold', color: '#E11D48' },
  alertLink: { textAlign: 'right', color: '#8B5CF6', fontWeight: 'bold', marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  productItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  productIconBg: { width: 40, height: 40, backgroundColor: '#F3F4F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  productQuantity: { fontSize: 13, color: '#6B7280' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' }
});