import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import {st} from './analytics/components';
import OverviewSub from './analytics/OverviewSub';
import BiomarkersSub from './analytics/BiomarkersSub';
import LabReportsSub from './analytics/LabReportsSub';
import DoctorsSub from './analytics/DoctorsSub';
import MedicationsSub from './analytics/MedicationsSub';

const SUB_TABS = ['Overview', 'Biomarkers', 'Lab Reports', 'Doctors', 'Medications'];

const AnalyticsTab = () => {
  const [subTab, setSubTab] = useState('Overview');

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(12)}} contentContainerStyle={{gap: s(6)}}>
        {SUB_TABS.map(t => (
          <TouchableOpacity
            key={t}
            style={[st.subPill, subTab === t && st.subPillActive]}
            onPress={() => setSubTab(t)}>
            <AppText
              variant="small"
              color={subTab === t ? Colors.white : Colors.textSecondary}
              style={{fontWeight: subTab === t ? '600' : '400'}}>
              {t}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {subTab === 'Overview' && <OverviewSub />}
      {subTab === 'Biomarkers' && <BiomarkersSub />}
      {subTab === 'Lab Reports' && <LabReportsSub />}
      {subTab === 'Doctors' && <DoctorsSub />}
      {subTab === 'Medications' && <MedicationsSub />}
    </View>
  );
};

export default AnalyticsTab;






