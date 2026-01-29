import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Modal } from 'react-native';
import Svg, { Path, Line, Rect, Text as SvgText, G, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  pe: number;
  high52: number;
  low52: number;
  priceHistory: number[];
}

const stocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.52,
    change: 2.34,
    changePercent: 1.33,
    volume: 52340000,
    marketCap: '2.8T',
    pe: 28.5,
    high52: 199.62,
    low52: 124.17,
    priceHistory: [165, 168, 172, 169, 175, 173, 178, 176, 180, 178],
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 141.80,
    change: -1.23,
    changePercent: -0.86,
    volume: 23450000,
    marketCap: '1.8T',
    pe: 25.2,
    high52: 153.78,
    low52: 102.21,
    priceHistory: [135, 138, 142, 140, 145, 143, 144, 142, 143, 141],
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 378.91,
    change: 4.56,
    changePercent: 1.22,
    volume: 18920000,
    marketCap: '2.8T',
    pe: 35.8,
    high52: 384.30,
    low52: 245.61,
    priceHistory: [355, 360, 365, 362, 370, 368, 375, 372, 380, 378],
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com',
    price: 178.25,
    change: 1.89,
    changePercent: 1.07,
    volume: 41230000,
    marketCap: '1.8T',
    pe: 62.4,
    high52: 189.77,
    low52: 118.35,
    priceHistory: [165, 170, 172, 168, 175, 173, 180, 176, 179, 178],
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.50,
    change: -3.21,
    changePercent: -1.28,
    volume: 89340000,
    marketCap: '790B',
    pe: 72.3,
    high52: 299.29,
    low52: 152.37,
    priceHistory: [260, 255, 258, 252, 250, 248, 252, 250, 249, 248],
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 875.28,
    change: 15.42,
    changePercent: 1.79,
    volume: 45670000,
    marketCap: '2.2T',
    pe: 68.9,
    high52: 974.00,
    low52: 392.30,
    priceHistory: [820, 835, 850, 840, 860, 855, 870, 865, 880, 875],
  },
];

interface Position {
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
}

interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop';
  quantity: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: Date;
}

export function TradingTerminal() {
  const [selectedStock, setSelectedStock] = useState<Stock>(stocks[0]);
  const [activeTab, setActiveTab] = useState<'chart' | 'orderbook' | 'positions' | 'orders'>('chart');
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('1');
  const [limitPrice, setLimitPrice] = useState('');
  const [orderMode, setOrderMode] = useState<'market' | 'limit' | 'stop'>('market');
  const [balance, setBalance] = useState(50000);

  const [positions, setPositions] = useState<Position[]>([
    { symbol: 'AAPL', shares: 10, avgCost: 165.00, currentPrice: 178.52 },
    { symbol: 'MSFT', shares: 5, avgCost: 350.00, currentPrice: 378.91 },
    { symbol: 'NVDA', shares: 3, avgCost: 750.00, currentPrice: 875.28 },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: '1', symbol: 'GOOGL', type: 'buy', orderType: 'limit', quantity: 5, price: 138.00, status: 'pending', timestamp: new Date() },
    { id: '2', symbol: 'TSLA', type: 'sell', orderType: 'stop', quantity: 2, price: 240.00, status: 'pending', timestamp: new Date() },
  ]);

  const totalPortfolioValue = positions.reduce((sum, pos) => sum + pos.shares * pos.currentPrice, 0);
  const totalGainLoss = positions.reduce((sum, pos) => sum + pos.shares * (pos.currentPrice - pos.avgCost), 0);

  const renderMiniChart = (data: number[], width = 100, height = 40) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const isPositive = data[data.length - 1] >= data[0];
    const color = isPositive ? Colors.dark.success : Colors.dark.error;

    return (
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path
          d={`M 0,${height} L ${points} L ${width},${height} Z`}
          fill="url(#chartGradient)"
        />
        <Path
          d={`M ${points}`}
          fill="none"
          stroke={color}
          strokeWidth={2}
        />
      </Svg>
    );
  };

  const renderFullChart = () => {
    const data = selectedStock.priceHistory;
    const width = SCREEN_WIDTH - 48;
    const height = 200;
    const padding = { top: 20, right: 10, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const min = Math.min(...data) * 0.98;
    const max = Math.max(...data) * 1.02;
    const range = max - min;

    const getX = (i: number) => padding.left + (i / (data.length - 1)) * chartWidth;
    const getY = (v: number) => padding.top + chartHeight - ((v - min) / range) * chartHeight;

    const pathData = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`).join(' ');
    const areaPath = `${pathData} L ${getX(data.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    const isPositive = selectedStock.change >= 0;
    const color = isPositive ? Colors.dark.success : Colors.dark.error;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartSymbol}>{selectedStock.symbol}</Text>
            <Text style={styles.chartName}>{selectedStock.name}</Text>
          </View>
          <View style={styles.chartPrice}>
            <Text style={styles.priceValue}>${selectedStock.price.toFixed(2)}</Text>
            <Text style={[styles.priceChange, { color }]}>
              {isPositive ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
            </Text>
          </View>
        </View>

        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="fullChartGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <Stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <G key={i}>
              <Line
                x1={padding.left}
                y1={padding.top + pct * chartHeight}
                x2={width - padding.right}
                y2={padding.top + pct * chartHeight}
                stroke={Colors.dark.border}
                strokeDasharray="4,4"
              />
              <SvgText
                x={padding.left - 5}
                y={padding.top + pct * chartHeight + 4}
                fontSize={10}
                fill={Colors.dark.textSecondary}
                textAnchor="end"
              >
                ${(max - pct * range).toFixed(0)}
              </SvgText>
            </G>
          ))}

          <Path d={areaPath} fill="url(#fullChartGradient)" />
          <Path d={pathData} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />

          {/* Current price line */}
          <Line
            x1={padding.left}
            y1={getY(selectedStock.price)}
            x2={width - padding.right}
            y2={getY(selectedStock.price)}
            stroke={color}
            strokeWidth={1}
            strokeDasharray="2,2"
          />
          <Circle
            cx={getX(data.length - 1)}
            cy={getY(selectedStock.price)}
            r={5}
            fill={color}
          />
        </Svg>

        {/* Trade buttons */}
        <View style={styles.tradeButtons}>
          <TouchableOpacity
            style={[styles.tradeButton, styles.buyButton]}
            onPress={() => {
              setOrderType('buy');
              setOrderModalVisible(true);
            }}
          >
            <Ionicons name="arrow-up" size={20} color={Colors.dark.text} />
            <Text style={styles.tradeButtonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tradeButton, styles.sellButton]}
            onPress={() => {
              setOrderType('sell');
              setOrderModalVisible(true);
            }}
          >
            <Ionicons name="arrow-down" size={20} color={Colors.dark.text} />
            <Text style={styles.tradeButtonText}>Sell</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPositions = () => (
    <View style={styles.positionsContainer}>
      <View style={styles.portfolioSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Portfolio Value</Text>
          <Text style={styles.summaryValue}>${totalPortfolioValue.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total P&L</Text>
          <Text style={[
            styles.summaryValue,
            { color: totalGainLoss >= 0 ? Colors.dark.success : Colors.dark.error }
          ]}>
            {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Cash</Text>
          <Text style={styles.summaryValue}>${balance.toLocaleString()}</Text>
        </View>
      </View>

      {positions.map((pos) => {
        const pnl = (pos.currentPrice - pos.avgCost) * pos.shares;
        const pnlPercent = ((pos.currentPrice - pos.avgCost) / pos.avgCost) * 100;
        const isPositive = pnl >= 0;

        return (
          <View key={pos.symbol} style={styles.positionCard}>
            <View style={styles.positionHeader}>
              <Text style={styles.positionSymbol}>{pos.symbol}</Text>
              <Text style={styles.positionShares}>{pos.shares} shares</Text>
            </View>
            <View style={styles.positionDetails}>
              <View>
                <Text style={styles.positionLabel}>Avg Cost</Text>
                <Text style={styles.positionValue}>${pos.avgCost.toFixed(2)}</Text>
              </View>
              <View>
                <Text style={styles.positionLabel}>Current</Text>
                <Text style={styles.positionValue}>${pos.currentPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.positionPnl}>
                <Text style={styles.positionLabel}>P&L</Text>
                <Text style={[styles.positionValue, { color: isPositive ? Colors.dark.success : Colors.dark.error }]}>
                  {isPositive ? '+' : ''}${pnl.toFixed(2)}
                </Text>
                <Text style={[styles.positionPercent, { color: isPositive ? Colors.dark.success : Colors.dark.error }]}>
                  ({isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%)
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderOrders = () => (
    <View style={styles.ordersContainer}>
      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color={Colors.dark.textSecondary} />
          <Text style={styles.emptyText}>No pending orders</Text>
        </View>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={[
                styles.orderTypeBadge,
                { backgroundColor: order.type === 'buy' ? Colors.dark.success + '20' : Colors.dark.error + '20' }
              ]}>
                <Text style={[
                  styles.orderTypeText,
                  { color: order.type === 'buy' ? Colors.dark.success : Colors.dark.error }
                ]}>
                  {order.type.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.orderSymbol}>{order.symbol}</Text>
              <View style={[
                styles.orderStatusBadge,
                { backgroundColor: order.status === 'pending' ? Colors.dark.warning + '20' : Colors.dark.success + '20' }
              ]}>
                <Text style={[
                  styles.orderStatusText,
                  { color: order.status === 'pending' ? Colors.dark.warning : Colors.dark.success }
                ]}>
                  {order.status}
                </Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.orderDetail}>
                {order.quantity} shares @ ${order.price?.toFixed(2)} ({order.orderType})
              </Text>
            </View>
            {order.status === 'pending' && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setOrders(orders.filter(o => o.id !== order.id))}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </View>
  );

  const handlePlaceOrder = () => {
    const qty = parseInt(quantity) || 0;
    if (qty <= 0) return;

    const price = orderMode === 'market' ? selectedStock.price : parseFloat(limitPrice) || selectedStock.price;
    const total = qty * price;

    if (orderType === 'buy' && total > balance) {
      return; // Insufficient funds
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      symbol: selectedStock.symbol,
      type: orderType,
      orderType: orderMode,
      quantity: qty,
      price: orderMode !== 'market' ? price : undefined,
      status: orderMode === 'market' ? 'filled' : 'pending',
      timestamp: new Date(),
    };

    if (orderMode === 'market') {
      // Execute immediately
      if (orderType === 'buy') {
        setBalance(prev => prev - total);
        const existingPosition = positions.find(p => p.symbol === selectedStock.symbol);
        if (existingPosition) {
          const newShares = existingPosition.shares + qty;
          const newAvgCost = ((existingPosition.shares * existingPosition.avgCost) + total) / newShares;
          setPositions(positions.map(p =>
            p.symbol === selectedStock.symbol
              ? { ...p, shares: newShares, avgCost: newAvgCost }
              : p
          ));
        } else {
          setPositions([...positions, {
            symbol: selectedStock.symbol,
            shares: qty,
            avgCost: price,
            currentPrice: price,
          }]);
        }
      } else {
        setBalance(prev => prev + total);
        const existingPosition = positions.find(p => p.symbol === selectedStock.symbol);
        if (existingPosition) {
          const newShares = existingPosition.shares - qty;
          if (newShares <= 0) {
            setPositions(positions.filter(p => p.symbol !== selectedStock.symbol));
          } else {
            setPositions(positions.map(p =>
              p.symbol === selectedStock.symbol
                ? { ...p, shares: newShares }
                : p
            ));
          }
        }
      }
    } else {
      setOrders([...orders, newOrder]);
    }

    setOrderModalVisible(false);
    setQuantity('1');
    setLimitPrice('');
  };

  return (
    <View style={styles.container}>
      {/* Stock selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.stockSelector}
        contentContainerStyle={styles.stockSelectorContent}
      >
        {stocks.map((stock) => (
          <TouchableOpacity
            key={stock.symbol}
            style={[
              styles.stockTab,
              selectedStock.symbol === stock.symbol && styles.stockTabActive,
            ]}
            onPress={() => setSelectedStock(stock)}
          >
            <Text style={[
              styles.stockTabSymbol,
              selectedStock.symbol === stock.symbol && styles.stockTabSymbolActive,
            ]}>
              {stock.symbol}
            </Text>
            <Text style={[
              styles.stockTabChange,
              { color: stock.change >= 0 ? Colors.dark.success : Colors.dark.error }
            ]}>
              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab navigation */}
      <View style={styles.tabNav}>
        {[
          { key: 'chart', icon: 'analytics', label: 'Chart' },
          { key: 'positions', icon: 'briefcase', label: 'Positions' },
          { key: 'orders', icon: 'document-text', label: 'Orders' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.key ? Colors.dark.primary : Colors.dark.textSecondary}
            />
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && styles.tabLabelActive,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'chart' && renderFullChart()}
        {activeTab === 'positions' && renderPositions()}
        {activeTab === 'orders' && renderOrders()}

        {/* Stock details */}
        {activeTab === 'chart' && (
          <View style={styles.stockDetails}>
            <Text style={styles.detailsTitle}>Stock Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Volume</Text>
                <Text style={styles.detailValue}>
                  {(selectedStock.volume / 1000000).toFixed(2)}M
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Market Cap</Text>
                <Text style={styles.detailValue}>{selectedStock.marketCap}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>P/E Ratio</Text>
                <Text style={styles.detailValue}>{selectedStock.pe}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>52W High</Text>
                <Text style={styles.detailValue}>${selectedStock.high52}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>52W Low</Text>
                <Text style={styles.detailValue}>${selectedStock.low52}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Order Modal */}
      <Modal
        visible={orderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.orderModal}>
            <View style={styles.orderModalHeader}>
              <Text style={styles.orderModalTitle}>
                {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedStock.symbol}
              </Text>
              <TouchableOpacity onPress={() => setOrderModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.orderTypeSelector}>
              {(['market', 'limit', 'stop'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.orderTypeButton,
                    orderMode === type && styles.orderTypeButtonActive,
                  ]}
                  onPress={() => setOrderMode(type)}
                >
                  <Text style={[
                    styles.orderTypeButtonText,
                    orderMode === type && styles.orderTypeButtonTextActive,
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.orderForm}>
              <View style={styles.orderInputGroup}>
                <Text style={styles.orderInputLabel}>Quantity</Text>
                <TextInput
                  style={styles.orderInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="1"
                  placeholderTextColor={Colors.dark.textSecondary}
                />
              </View>

              {orderMode !== 'market' && (
                <View style={styles.orderInputGroup}>
                  <Text style={styles.orderInputLabel}>
                    {orderMode === 'limit' ? 'Limit' : 'Stop'} Price
                  </Text>
                  <TextInput
                    style={styles.orderInput}
                    value={limitPrice}
                    onChangeText={setLimitPrice}
                    keyboardType="numeric"
                    placeholder={selectedStock.price.toFixed(2)}
                    placeholderTextColor={Colors.dark.textSecondary}
                  />
                </View>
              )}

              <View style={styles.orderSummary}>
                <Text style={styles.orderSummaryLabel}>Estimated Total</Text>
                <Text style={styles.orderSummaryValue}>
                  ${((parseInt(quantity) || 0) * (orderMode === 'market' ? selectedStock.price : (parseFloat(limitPrice) || selectedStock.price))).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.placeOrderButton,
                  { backgroundColor: orderType === 'buy' ? Colors.dark.success : Colors.dark.error }
                ]}
                onPress={handlePlaceOrder}
              >
                <Text style={styles.placeOrderButtonText}>
                  Place {orderType === 'buy' ? 'Buy' : 'Sell'} Order
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  stockSelector: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  stockSelectorContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  stockTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.dark.card,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
  },
  stockTabActive: {
    backgroundColor: Colors.dark.primary + '30',
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  stockTabSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  stockTabSymbolActive: {
    color: Colors.dark.text,
  },
  stockTabChange: {
    fontSize: 11,
    marginTop: 2,
  },
  tabNav: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: Colors.dark.primary + '20',
  },
  tabLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  tabLabelActive: {
    color: Colors.dark.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  chartContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  chartName: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  chartPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  tradeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  tradeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buyButton: {
    backgroundColor: Colors.dark.success,
  },
  sellButton: {
    backgroundColor: Colors.dark.error,
  },
  tradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  stockDetails: {
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    width: '30%',
    backgroundColor: Colors.dark.background,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: 4,
  },
  // Positions
  positionsContainer: {
    gap: 12,
  },
  portfolioSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 4,
  },
  positionCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  positionSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  positionShares: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  positionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionLabel: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
  },
  positionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: 2,
  },
  positionPnl: {
    alignItems: 'flex-end',
  },
  positionPercent: {
    fontSize: 11,
  },
  // Orders
  ordersContainer: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  orderTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderTypeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  orderSymbol: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  orderDetails: {
    marginBottom: 8,
  },
  orderDetail: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  cancelButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.dark.error + '20',
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 12,
    color: Colors.dark.error,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 12,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  orderModal: {
    backgroundColor: Colors.dark.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  orderModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  orderModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  orderTypeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  orderTypeButtonActive: {
    backgroundColor: Colors.dark.primary,
  },
  orderTypeButtonText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  orderTypeButtonTextActive: {
    color: Colors.dark.text,
  },
  orderForm: {
    gap: 16,
  },
  orderInputGroup: {
    gap: 8,
  },
  orderInputLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  orderInput: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  orderSummaryLabel: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  orderSummaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  placeOrderButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
});
