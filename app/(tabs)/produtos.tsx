import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// --- MOCK DATA ---
const categories = ['Todos', 'Bebidas', 'Alimentos', 'Limpeza'];

const allProducts = [
  { id: '1', name: 'Café Especial 250g', quantity: '4 un', category: 'Bebidas', status: 'Baixo' },
  { id: '2', name: 'Água Mineral 500ml', quantity: '48 un', category: 'Bebidas', status: 'Normal' },
  { id: '3', name: 'Suco de Laranja', quantity: '6 un', category: 'Bebidas', status: 'Baixo' },
  { id: '4', name: 'Arroz Branco 5kg', quantity: '15 cx', category: 'Alimentos', status: 'Normal' },
  { id: '5', name: 'Feijão Carioca', quantity: '3 un', category: 'Alimentos', status: 'Baixo' },
  { id: '6', name: 'Sabão em Pó', quantity: '0 cx', category: 'Limpeza', status: 'Sem estoque' },
];

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

export default function Produtos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  // --- FILTRO OTIMIZADO COM useMemo ---
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Produtos</Text>
          <TouchableOpacity style={styles.fab}>
            <Feather name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Campo de busca com TextInput */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produto..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Chips de categoria (.map) */}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {categories.map((cat, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.chip, activeCategory === cat && styles.chipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* FlatList com useMemo */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.productIconBg}>
              <Feather name="package" size={20} color="#CDA484" /> 
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
  header: { padding: 20, paddingBottom: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  fab: { backgroundColor: '#8B5CF6', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#1F2937' },
  chipsContainer: { gap: 10, paddingRight: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6' },
  chipActive: { backgroundColor: '#8B5CF6' },
  chipText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  chipTextActive: { color: '#FFF' },
  listContent: { padding: 20, paddingTop: 10 },
  productItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  productIconBg: { width: 40, height: 40, backgroundColor: '#F3F4F6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  productQuantity: { fontSize: 13, color: '#6B7280' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, color: '#9CA3AF', fontSize: 16 }
});