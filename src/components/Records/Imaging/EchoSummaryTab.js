import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const insightCards = [
  {
    label: 'Ejection Fraction',
    value: 'EF 62%',
    detail: 'Normal systolic function',
    iconName: 'heart-outline',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    label: 'LV Hypertrophy',
    value: 'No LVH',
    detail: 'Wall thickness normal',
    iconName: 'resize-outline',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    label: 'Valves',
    value: 'Normal',
    detail: 'All 4 valves normal',
    iconName: 'git-compare-outline',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    label: 'Diastolic Function',
    value: 'Grade 1',
    detail: 'Mild impaired relaxation',
    iconName: 'pulse-outline',
    bg: Colors.blueBg,
    color: Colors.blueText,
    pillBg: Colors.amberBg,
    pillColor: Colors.amberText,
  },
];

const actionItems = [
  {icon: 'fitness-outline', label: 'Continue BP control to prevent LVH progression'},
  {icon: 'restaurant-outline', label: 'Reduce salt intake to < 5g/day'},
  {icon: 'calendar-outline', label: 'Repeat echo in 12 months'},
];

const lvDimensions = [
  {param: 'LVIDd', value: '4.6 cm', ref: '3.5\u20135.6'},
  {param: 'LVIDs', value: '3.0 cm', ref: '2.0\u20134.0'},
  {param: 'IVS', value: '0.95 cm', ref: '0.6\u20131.1'},
  {param: 'PW', value: '0.90 cm', ref: '0.6\u20131.1'},
  {param: 'EF', value: '62%', ref: '55\u201370%'},
  {param: 'FS', value: '35%', ref: '25\u201345%'},
];

const valveRows = [
  {name: 'Mitral valve', status: 'Normal'},
  {name: 'Aortic valve', status: 'Normal'},
  {name: 'Tricuspid valve', status: 'Normal'},
  {name: 'Pulmonary valve', status: 'Normal'},
];

const EchoSummaryTab = () => {
  const [viewMode, setViewMode] = useState('smart');

  const renderToggle = () => (
    <View style={styles.toggleRow}>
      <TouchableOpacity
        style={[styles.toggleBtn, viewMode === 'smart' && styles.toggleActive]}
        onPress={() => setViewMode('smart')}>
        <AppText
          variant="caption"
          color={viewMode === 'smart' ? Colors.white : Colors.textSecondary}
          style={{fontWeight: '600'}}>
          Smart View
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleBtn, viewMode === 'traditional' && styles.toggleActive]}
        onPress={() => setViewMode('traditional')}>
        <AppText
          variant="caption"
          color={viewMode === 'traditional' ? Colors.white : Colors.textSecondary}
          style={{fontWeight: '600'}}>
          Traditional
        </AppText>
      </TouchableOpacity>
    </View>
  );

  // ── Smart View ──

  const renderImagePreview = () => (
    <View style={styles.imagePreview}>
      <Icon family="Ionicons" name="heart-outline" size={48} color="rgba(255,255,255,0.5)" />
      <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginTop: vs(8)}}>
        2D Echocardiogram  |  18 Sep 2025
      </AppText>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.btnRow}>
      {[
        {icon: 'play-circle-outline', label: 'View echo video'},
        {icon: 'analytics-outline', label: 'M-mode'},
        {icon: 'pulse-outline', label: 'Doppler'},
      ].map((btn, i) => (
        <TouchableOpacity key={i} style={styles.actionBtn}>
          <Icon family="Ionicons" name={btn.icon} size={18} color={Colors.primary} />
          <AppText variant="small" color={Colors.primary} style={{marginTop: vs(4), textAlign: 'center'}}>
            {btn.label}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderNarrativeBanner = () => (
    <View style={[styles.insightBox, {backgroundColor: Colors.tealBg}]}>
      <Icon family="Ionicons" name="document-text-outline" size={18} color={Colors.tealText} />
      <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
        Heart structure and systolic function are normal. Mild Grade 1 diastolic dysfunction noted, consistent with age and hypertension.
      </AppText>
    </View>
  );

  const renderInsightCards = () => (
    <View style={styles.gridContainer}>
      {insightCards.map((card, i) => (
        <View key={i} style={styles.gridItem}>
          <View style={[styles.gridCard, {backgroundColor: Colors.white}]}>
            <View style={[styles.iconCircle, {backgroundColor: card.bg}]}>
              <Icon family="Ionicons" name={card.iconName} size={16} color={card.color} />
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
              {card.label}
            </AppText>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(2), gap: s(4)}}>
              <AppText variant="bodyBold" color={card.color}>
                {card.value}
              </AppText>
              {card.pillBg && (
                <View style={[styles.pill, {backgroundColor: card.pillBg}]}>
                  <AppText variant="small" color={card.pillColor}>Watch</AppText>
                </View>
              )}
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
              {card.detail}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderActionsCard = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Actions</AppText>
      {actionItems.map((item, i) => (
        <View
          key={i}
          style={[
            styles.actionRow,
            i < actionItems.length - 1 && styles.rowBorder,
          ]}>
          <View style={[styles.iconCircle, {backgroundColor: Colors.tealBg}]}>
            <Icon family="Ionicons" name={item.icon} size={16} color={Colors.tealText} />
          </View>
          <AppText variant="caption" style={{flex: 1}}>{item.label}</AppText>
        </View>
      ))}
    </View>
  );

  const renderSmartView = () => (
    <>
      {renderImagePreview()}
      {renderActionButtons()}
      {renderNarrativeBanner()}
      {renderInsightCards()}
      {renderActionsCard()}
    </>
  );

  // ── Traditional View ──

  const renderTraditionalView = () => (
    <>
      {/* Header */}
      <View style={styles.card}>
        <AppText variant="bodyBold">Yashoda Hospitals</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          2D Echocardiography Report  |  18 Sep 2025
        </AppText>
      </View>

      {/* LV Dimensions */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>LV Dimensions</AppText>
        {lvDimensions.map((row, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i < lvDimensions.length - 1 && styles.rowBorder,
            ]}>
            <AppText variant="caption" style={{flex: 1}}>{row.param}</AppText>
            <AppText variant="bodyBold" style={{width: s(70), textAlign: 'center'}}>{row.value}</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{width: s(70), textAlign: 'right'}}>
              {row.ref}
            </AppText>
          </View>
        ))}
      </View>

      {/* LV Function */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>LV Function</AppText>
        <View style={[styles.tableRow, styles.rowBorder]}>
          <AppText variant="caption" style={{flex: 1}}>Systolic function</AppText>
          <AppText variant="caption" color={Colors.tealText}>Normal</AppText>
        </View>
        <View style={[styles.tableRow, styles.rowBorder]}>
          <AppText variant="caption" style={{flex: 1}}>Diastolic function</AppText>
          <AppText variant="caption" color={Colors.amberText}>Grade 1</AppText>
        </View>
        <View style={styles.tableRow}>
          <AppText variant="caption" style={{flex: 1}}>E/A ratio</AppText>
          <AppText variant="caption">0.8</AppText>
        </View>
      </View>

      {/* Valves */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Valves</AppText>
        {valveRows.map((row, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i < valveRows.length - 1 && styles.rowBorder,
            ]}>
            <AppText variant="caption" style={{flex: 1}}>{row.name}</AppText>
            <AppText variant="caption" color={Colors.tealText}>{row.status}</AppText>
          </View>
        ))}
      </View>

      {/* Impression */}
      <View style={[styles.insightBox, {backgroundColor: Colors.background}]}>
        <Icon family="Ionicons" name="clipboard-outline" size={18} color={Colors.primary} />
        <View style={{flex: 1}}>
          <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>Impression</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            Normal LV dimensions with preserved systolic function (EF 62%). Grade 1 diastolic dysfunction with impaired relaxation pattern. All valves structurally and functionally normal. No pericardial effusion.
          </AppText>
        </View>
      </View>
    </>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderToggle()}
      {viewMode === 'smart' ? renderSmartView() : renderTraditionalView()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(4),
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(3),
    marginBottom: vs(12),
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(7),
    borderRadius: ms(8),
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  imagePreview: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(32),
    marginBottom: vs(10),
  },
  btnRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(10),
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: s(6),
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(11),
    marginBottom: vs(12),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: s(-4),
    marginBottom: vs(10),
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: s(4),
    marginBottom: vs(8),
  },
  gridCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(12),
  },
  iconCircle: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    paddingVertical: vs(10),
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(9),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
});

export default EchoSummaryTab;
