import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const insightCards = [
  {
    label: 'Liver',
    value: 'Grade 1 NAFLD',
    detail: 'Fatty liver detected',
    iconName: 'fitness-outline',
    bg: Colors.amberBg,
    color: Colors.amberText,
  },
  {
    label: 'Kidneys',
    value: 'Normal',
    detail: 'Bilateral normal size & cortex',
    iconName: 'medkit-outline',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    label: 'Gallbladder',
    value: 'Clear',
    detail: 'No stones or sludge',
    iconName: 'shield-checkmark-outline',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    label: 'USG Repeat',
    value: 'Overdue',
    detail: 'Last done > 12 months ago',
    iconName: 'time-outline',
    bg: Colors.redBg,
    color: Colors.redText,
  },
];

const actionItems = [
  {icon: 'nutrition-outline', label: 'Reduce saturated fat and refined carbs'},
  {icon: 'walk-outline', label: 'Aim for 150 min/week moderate exercise'},
  {icon: 'calendar-outline', label: 'Schedule repeat USG abdomen'},
];

const liverRows = [
  {param: 'Size', value: '14.2 cm', note: 'Borderline', noteColor: Colors.amberText},
  {param: 'Echogenicity', value: 'Grade 1', note: 'Fatty change', noteColor: Colors.amberText},
  {param: 'Texture', value: 'Homogeneous', note: 'Normal', noteColor: Colors.tealText},
  {param: 'Portal vein', value: '11 mm', note: 'Normal', noteColor: Colors.tealText},
];

const organRows = [
  {organ: 'Right kidney', size: '10.2 cm', status: 'Normal'},
  {organ: 'Left kidney', size: '10.5 cm', status: 'Normal'},
  {organ: 'Gallbladder', size: 'Normal', status: 'No calculi'},
  {organ: 'Spleen', size: '10.8 cm', status: 'Normal'},
  {organ: 'Pancreas', size: 'Normal', status: 'Normal'},
];

const UsgSummaryTab = () => {
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
      <Icon family="Ionicons" name="radio-outline" size={48} color="rgba(255,255,255,0.5)" />
      <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginTop: vs(8)}}>
        USG Abdomen  |  22 Aug 2025
      </AppText>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.btnRow}>
      {[
        {icon: 'images-outline', label: 'View all images'},
        {icon: 'document-text-outline', label: 'Full report'},
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
    <View style={[styles.insightBox, {backgroundColor: Colors.amberBg}]}>
      <Icon family="Ionicons" name="alert-circle-outline" size={18} color={Colors.amberText} />
      <AppText variant="caption" color={Colors.amberText} style={{flex: 1}}>
        Grade 1 fatty liver (NAFLD) detected. Kidneys, gallbladder, spleen, and pancreas are normal. Liver size is borderline at 14.2 cm.
      </AppText>
    </View>
  );

  const renderInsightCards = () => (
    <View style={styles.gridContainer}>
      {insightCards.map((card, i) => (
        <View key={i} style={styles.gridItem}>
          <View style={styles.gridCard}>
            <View style={[styles.iconCircle, {backgroundColor: card.bg}]}>
              <Icon family="Ionicons" name={card.iconName} size={16} color={card.color} />
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
              {card.label}
            </AppText>
            <AppText variant="bodyBold" color={card.color} style={{marginTop: vs(2)}}>
              {card.value}
            </AppText>
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
      <View style={styles.card}>
        <AppText variant="bodyBold">Kamineni Hospitals</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          USG Abdomen Report  |  22 Aug 2025
        </AppText>
      </View>

      {/* Liver Section */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Liver</AppText>
        {liverRows.map((row, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i < liverRows.length - 1 && styles.rowBorder,
            ]}>
            <AppText variant="caption" style={{flex: 1}}>{row.param}</AppText>
            <AppText variant="bodyBold" style={{width: s(80), textAlign: 'center'}}>{row.value}</AppText>
            <AppText variant="small" color={row.noteColor} style={{width: s(70), textAlign: 'right'}}>
              {row.note}
            </AppText>
          </View>
        ))}
      </View>

      {/* Kidneys & Organs */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Kidneys & Other Organs</AppText>
        {organRows.map((row, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i < organRows.length - 1 && styles.rowBorder,
            ]}>
            <AppText variant="caption" style={{flex: 1}}>{row.organ}</AppText>
            <AppText variant="caption" style={{width: s(60), textAlign: 'center'}}>{row.size}</AppText>
            <AppText variant="small" color={Colors.tealText} style={{width: s(70), textAlign: 'right'}}>
              {row.status}
            </AppText>
          </View>
        ))}
      </View>

      {/* Impression */}
      <View style={[styles.insightBox, {backgroundColor: Colors.background}]}>
        <Icon family="Ionicons" name="clipboard-outline" size={18} color={Colors.primary} />
        <View style={{flex: 1}}>
          <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>Impression</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            Grade 1 fatty liver with borderline hepatomegaly. Both kidneys normal in size, shape, and echotexture. Gallbladder, spleen, and pancreas are unremarkable. No free fluid.
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
    backgroundColor: Colors.amber,
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

export default UsgSummaryTab;
