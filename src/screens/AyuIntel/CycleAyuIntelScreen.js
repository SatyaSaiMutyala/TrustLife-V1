import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const InsightRow = ({color, children}) => (
  <View style={st.insightRow}>
    <View style={[st.insightDot, {backgroundColor: color}]} />
    <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(18)}}>{children}</AppText>
  </View>
);

const Card = ({icon, iconBg, title, sub, badge, badgeBg, badgeColor, children}) => (
  <View style={st.card}>
    <View style={st.cardHdr}>
      <View style={[st.cardIcon, {backgroundColor: iconBg}]}><Icon family="Ionicons" name={icon} size={ms(16)} color={Colors.white} /></View>
      <View style={{flex: 1}}><AppText variant="bodyBold" color={Colors.textPrimary}>{title}</AppText><AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{sub}</AppText></View>
      {badge && <View style={[st.badge, {backgroundColor: badgeBg}]}><AppText variant="subtext" color={badgeColor} style={{fontWeight: '700'}}>{badge}</AppText></View>}
    </View>
    <View style={st.cardBody}>{children}</View>
  </View>
);

const ProgressBar = ({label, value, percent, color}) => (
  <View style={{paddingVertical: vs(6)}}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
      <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{label}</AppText>
      <AppText variant="small" color={color} style={{fontWeight: '700'}}>{value}</AppText>
    </View>
    <View style={st.progressTrack}>
      <View style={[st.progressFill, {width: `${percent}%`, backgroundColor: color}]} />
    </View>
  </View>
);

/* TAB 1: OVERVIEW */
export const CycleOverviewPanel = () => (
  <View>
    <View style={st.alertBoxAmber}>
      <Icon family="Ionicons" name="warning-outline" size={ms(16)} color={Colors.amberDark} />
      <AppText variant="caption" color={Colors.amberDark} style={{flex: 1, lineHeight: ms(18)}}><AppText style={{fontWeight: '700'}}>Late luteal phase alert (Day 24).</AppText> You are in the PMS window (Days 21-28). Migraine risk is elevated, blood glucose may rise 10-15%, and mood dip is expected. This is your most symptomatic phase - prioritise sleep, magnesium, and gentle movement.</AppText>
    </View>
    <Card icon="ellipse-outline" iconBg={Colors.accent} title="Current phase - Late luteal" sub="Days 21-28 - progesterone withdrawal phase" badge="PMS window" badgeBg={Colors.amberBg} badgeColor={Colors.amberDark}>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Migraine risk is highest in this phase.</AppText> Oestrogen withdrawal triggers catamenial migraine in 60% of female migraineurs. Your pattern shows 7 of 9 migraines occurring on Days 23-28.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Blood glucose rises 10-15% in the late luteal phase.</AppText> Progesterone withdrawal reduces insulin sensitivity. Your CGM data confirms fasting glucose averaging 12mg/dL higher on Days 22-28 vs Days 5-12.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Mood dip expected.</AppText> Serotonin drops as oestrogen and progesterone fall. Your PHQ-9 scores are consistently 3-4 points higher in the luteal phase. This is physiological, not personal failure.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Bloating and water retention peak on Days 24-27.</AppText> Aldosterone rises as progesterone falls. Reduce sodium intake and increase potassium-rich foods (banana, coconut water, spinach).</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Helpful supplements for this phase:</AppText> Magnesium glycinate 400mg (cramps + sleep + migraine prevention), Vitamin B6 50mg (serotonin synthesis), calcium 500mg (reduces PMS severity by 48% in trials).</InsightRow>
    </Card>
    <Card icon="analytics-outline" iconBg="#185FA5" title="9-cycle pattern analysis" sub="Tracking data from Jul 2025 to Mar 2026">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Cycle regularity is good.</AppText> Average cycle length 27.8 days (range 26-30 days). Variation of 4 days or less indicates consistent ovulation and healthy hypothalamic-pituitary-ovarian axis function.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Luteal phase averages 12.5 days</AppText> (range 11-14 days). A luteal phase of 10 days or more is considered adequate for progesterone production and endometrial support.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Period duration is trending longer.</AppText> Average 5.2 days over 9 cycles, but last 3 cycles averaged 6.0 days. Monitor for heavy menstrual bleeding (HMB) - soaking a pad in under 2 hours or clots larger than a 1-rupee coin.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Migraine correlation confirmed.</AppText> 78% of your migraines cluster in Days 23-3 (late luteal to early menstrual). This is a classic catamenial migraine pattern driven by oestrogen withdrawal.</InsightRow>
    </Card>
    <Card icon="flag-outline" iconBg={Colors.red} title="Priority actions this cycle" sub="Based on your cycle phase + health profile">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Start migraine prevention protocol now.</AppText> Take magnesium 400mg and riboflavin 400mg daily through Day 3. Consider frovatriptan 2.5mg on Days 25-2 if your neurologist approves perimenstrual prophylaxis.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Tighten glucose monitoring on Days 24-28.</AppText> Expect fasting glucose to be 10-15% higher. Do not increase Metformin without consulting your doctor - this is a physiological rise that resolves with menstruation.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Prioritise sleep this week.</AppText> Progesterone (a natural sedative) is falling. Melatonin 0.5mg or magnesium glycinate before bed can compensate. Avoid screens after 9 PM.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Gentle movement only.</AppText> Replace HIIT with walking, yoga, or swimming on Days 24-28. Cortisol is already elevated in the late luteal phase - intense exercise adds to the stress load.</InsightRow>
    </Card>
  </View>
);

/* TAB 2: CONDITIONS */
export const CycleConditionsPanel = () => (
  <View>
    <Card icon="alert-circle-outline" iconBg="#F97316" title="PCOS/PCOD - risk assessment" sub="4 of 9 indicators present" badge="Moderate" badgeBg={Colors.amberBg} badgeColor={Colors.amberDark}>
      <View style={{paddingVertical: vs(6)}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
          <AppText variant="small" color={Colors.textSecondary}>Risk score</AppText>
          <AppText variant="small" color="#F97316" style={{fontWeight: '700'}}>44% (4/9 indicators)</AppText>
        </View>
        <View style={st.progressTrack}>
          <View style={[st.progressFill, {width: '44%', backgroundColor: '#F97316'}]} />
        </View>
      </View>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Indicators present:</AppText> Insulin resistance (T2DM), irregular cycle history (before tracking), acne pattern on jawline, and elevated free testosterone suspicion (not yet tested).</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Indicators absent:</AppText> Cycles are now regular (27-30 days), no hirsutism, BMI within range, no ultrasound evidence of polycystic ovaries, LH:FSH ratio not elevated on last test.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>PCOS and T2DM share insulin resistance as a root driver.</AppText> Your Metformin already addresses this. Inositol (myo-inositol 4g + D-chiro-inositol 100mg daily) is the most evidence-based supplement for PCOS insulin sensitisation.</InsightRow>
      <InsightRow color="#185FA5"><AppText style={{fontWeight: '700'}}>Action:</AppText> Request free testosterone and DHEAS blood tests at your next appointment. These two tests will clarify your PCOS risk definitively.</InsightRow>
      <View style={st.infoBox}>
        <Icon family="Ionicons" name="information-circle-outline" size={ms(15)} color={Colors.blueText} />
        <AppText variant="small" color={Colors.blueText} style={{flex: 1, lineHeight: ms(16)}}>PCOS is diagnosed using the Rotterdam criteria: 2 of 3 features (oligo/anovulation, hyperandrogenism, polycystic ovaries on ultrasound). You currently meet 1 confirmed criterion.</AppText>
      </View>
    </Card>
    <Card icon="bandage-outline" iconBg="#7C3AED" title="Endometriosis risk signals" sub="Screening based on symptom pattern">
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Dysmenorrhoea (painful periods) is your primary signal.</AppText> Pain rated 6-7/10 on Days 1-2, requiring NSAIDs. Endometriosis affects 10% of women and takes an average of 7.5 years to diagnose.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Reassuring factors:</AppText> No dyspareunia (pain during intercourse), no chronic pelvic pain outside menstruation, no bowel or bladder symptoms with periods, and no family history of endometriosis.</InsightRow>
      <InsightRow color="#185FA5"><AppText style={{fontWeight: '700'}}>Monitor:</AppText> If period pain worsens progressively, or if pain starts extending beyond Days 1-2, discuss transvaginal ultrasound with your gynaecologist. Early detection prevents adhesion formation.</InsightRow>
    </Card>
    <Card icon="sync-outline" iconBg="#185FA5" title="Thyroid - Cycle connection" sub="TSH and thyroid hormones directly affect cycles">
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Subclinical hypothyroidism (TSH 4.2-5.5) can lengthen cycles and increase period heaviness.</AppText> Your TSH is currently within range but should be checked every 6 months given your T2DM and family history.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Thyroid antibodies (TPO-Ab) should be tested once.</AppText> Hashimoto's thyroiditis is 5-8x more common in women and causes progressive thyroid failure that first manifests as cycle changes.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Your current cycle regularity is reassuring.</AppText> Regular 27-30 day cycles strongly suggest adequate thyroid function for reproductive health.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Selenium 200mcg daily supports thyroid function</AppText> and reduces TPO antibodies by 21% in Hashimoto's. Brazil nuts (2-3 daily) provide this naturally.</InsightRow>
    </Card>
    <Card icon="scan-outline" iconBg={Colors.red} title="Uterine fibroids - monitoring signals" sub="Common in reproductive-age women">
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Your trending longer periods (5.2 to 6.0 days) warrant monitoring.</AppText> Fibroids are the most common cause of heavy menstrual bleeding in women aged 30-50, affecting 20-40% of women.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>No other fibroid signals currently.</AppText> No intermenstrual bleeding, no pelvic pressure, and no urinary frequency changes reported.</InsightRow>
      <InsightRow color="#185FA5"><AppText style={{fontWeight: '700'}}>If period duration reaches 7+ days or flow becomes significantly heavier,</AppText> a pelvic ultrasound is the first-line investigation. Fibroids are benign and highly treatable when detected early.</InsightRow>
    </Card>
    <Card icon="thunderstorm-outline" iconBg="#7C3AED" title="PMDD - Premenstrual Dysphoric Disorder" sub="Severe PMS variant - screening assessment">
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Your luteal phase mood dip (PHQ-9 increase of 3-4 points) is consistent with PMS, not PMDD.</AppText> PMDD requires 5+ symptoms with functional impairment during the luteal phase in at least 2 consecutive cycles.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Key distinction:</AppText> PMS is uncomfortable but manageable. PMDD causes severe depression, anxiety, or rage that disrupts work, relationships, or daily functioning. Your symptoms currently fall in the PMS range.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>If luteal mood symptoms worsen,</AppText> track daily using the DRSP (Daily Record of Severity of Problems) for 2 cycles. SSRIs taken only during the luteal phase (Days 14-28) are the first-line PMDD treatment with 60-70% response rate.</InsightRow>
    </Card>
    <Card icon="hourglass-outline" iconBg="#F0B429" title="Perimenopause & POI awareness" sub="Age-appropriate screening information">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>At your age, perimenopause is not expected for 5-10 years.</AppText> Average age of perimenopause onset is 45-47, with menopause at 51. Your regular cycles are reassuring.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Premature ovarian insufficiency (POI) affects 1% of women under 40.</AppText> Warning signs: cycles becoming irregular or absent, hot flushes, night sweats, vaginal dryness. Your risk factors include autoimmune predisposition (T2DM).</InsightRow>
      <InsightRow color="#185FA5"><AppText style={{fontWeight: '700'}}>AMH (Anti-Mullerian Hormone) is the best single test for ovarian reserve.</AppText> Consider a baseline AMH test at age 35-37 for future fertility planning reference, even if not actively trying to conceive.</InsightRow>
    </Card>
  </View>
);

/* TAB 3: CORRELATIONS */
export const CycleCorrelationsPanel = () => (
  <View>
    <Card icon="water-outline" iconBg="#F0B429" title="T2DM - Cycle correlations" sub="Strongest link in your health profile" badge="Strongest link" badgeBg={Colors.amberBg} badgeColor={Colors.amberDark}>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Insulin resistance worsens in the luteal phase.</AppText> Progesterone reduces insulin sensitivity by 15-20%. Your CGM confirms fasting glucose averages 118mg/dL on Days 22-28 vs 104mg/dL on Days 5-12.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>HbA1c reflects a blended average across all cycle phases.</AppText> Your 7.8% likely represents ~7.2% in the follicular phase and ~8.4% in the luteal phase. Phase-aware glucose management could improve overall HbA1c by 0.3-0.5%.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Menstruation itself causes a temporary glucose drop.</AppText> Days 1-3 often show lower fasting glucose due to prostaglandin-mediated inflammation increasing metabolic rate. Do not reduce Metformin based on these readings.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Metformin improves cycle regularity independently of glucose control.</AppText> It reduces ovarian androgen production and improves ovulatory function - a dual benefit for your profile.</InsightRow>
    </Card>
    <Card icon="flash-outline" iconBg="#7C3AED" title="Migraine - Cycle correlations" sub="Catamenial migraine pattern confirmed" badge="Catamenial" badgeBg={Colors.purpleBg} badgeColor={Colors.purpleDark}>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>78% of your migraines occur on Days 23-3 (perimenstrual window).</AppText> This is a textbook catamenial migraine pattern driven by oestrogen withdrawal of more than 30% over 5 days.</InsightRow>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Oestrogen withdrawal is the trigger, not low oestrogen itself.</AppText> The rate of decline matters more than the absolute level. This is why migraines peak on Days 25-1, not during low-oestrogen phases.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Perimenstrual prophylaxis:</AppText> Frovatriptan 2.5mg twice daily from Day 23 to Day 2 reduces catamenial migraine frequency by 50-60%. Discuss with your neurologist as a targeted strategy.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Magnesium 400mg daily throughout the cycle</AppText> reduces migraine frequency by 41% in trials. It also reduces menstrual cramps and improves sleep - triple benefit for your profile.</InsightRow>
    </Card>
    <Card icon="bicycle-outline" iconBg={Colors.accent} title="Lifestyle - Cycle correlations" sub="Your tracked data reveals clear patterns">
      <ProgressBar label="Exercise in follicular phase" value="+78% performance" percent={78} color={Colors.accent} />
      <ProgressBar label="Poor sleep in luteal phase" value="+84% symptom burden" percent={84} color={Colors.red} />
      <ProgressBar label="High stress shifts cycle" value="+2-3 day shift" percent={65} color="#F97316" />
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Alcohol in the luteal phase doubles PMS severity.</AppText> Your data shows 3 of 4 worst PMS months coincided with social drinking on Days 20-25. Alcohol depletes B vitamins and disrupts oestrogen metabolism via the liver.</InsightRow>
    </Card>
    <Card icon="medical-outline" iconBg="#185FA5" title="Medication - Cycle correlations" sub="How your medications interact with cycle phases">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Metformin (T2DM):</AppText> Improves cycle regularity and reduces androgen levels. GI side effects may worsen during menstruation due to prostaglandin-mediated gut motility. Take with food on Days 1-3.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Olmesartan (HTN):</AppText> No significant cycle interaction. Blood pressure naturally dips in the follicular phase and rises in the luteal phase - this is normal and does not require dose adjustment.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>NSAIDs (Ibuprofen for cramps):</AppText> Effective for prostaglandin-mediated pain on Days 1-2. Start before pain onset for maximum efficacy. Avoid more than 3 consecutive days to protect kidneys (T2DM + HTN risk).</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Topiramate (migraine prevention):</AppText> May reduce period heaviness slightly (a beneficial side effect). Does not affect cycle length or ovulation. Ensure adequate hydration as Topiramate increases kidney stone risk.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Ferrous sulphate (iron):</AppText> Absorption is best in the follicular phase when oestrogen is rising. Take with vitamin C on Days 5-14 for maximum absorption. Avoid taking within 2 hours of Metformin.</InsightRow>
    </Card>
    <Card icon="happy-outline" iconBg="#7C3AED" title="Mental health - Cycle correlations" sub="PHQ-9 and cycle phase patterns">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>PHQ-9 scores are 3-4 points higher in the luteal phase (Days 21-28).</AppText> This cyclical pattern is driven by serotonin depletion as oestrogen and progesterone withdraw. Recognising the pattern reduces self-blame.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Follicular phase (Days 5-14) is your best mental health window.</AppText> Oestrogen rises, serotonin and dopamine increase, energy peaks. Schedule challenging tasks, important decisions, and social events in this phase when possible.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Exercise has the strongest antidepressant effect in the luteal phase.</AppText> Even 20 minutes of walking raises serotonin and BDNF. Your data shows 40% fewer low-mood days in months with consistent luteal-phase walking.</InsightRow>
    </Card>
    <Card icon="leaf-outline" iconBg={Colors.red} title="Iron - Cycle loop" sub="Menstruation depletes iron - iron affects your cycle">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Each period loses 30-40mg of iron.</AppText> With your Hb of 11.8g/dL (borderline low), your iron stores are not fully replenishing between cycles. Trending longer periods (6 days) increase this loss further.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Low iron worsens fatigue, brain fog, and cold intolerance in the luteal phase.</AppText> These symptoms overlap with PMS - many women attribute iron deficiency symptoms to PMS and miss the treatable cause.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Iron repletion strategy:</AppText> Ferrous sulphate 200mg on alternate days (better absorbed than daily), taken with vitamin C, on an empty stomach in the follicular phase. Target ferritin above 50mcg/L for symptom resolution.</InsightRow>
    </Card>
  </View>
);

/* TAB 4: HORMONES */
export const CycleHormonesPanel = () => (
  <View>
    <Card icon="pulse-outline" iconBg="#7C3AED" title="Your hormone timeline - 28-day cycle" sub="Current phase: Late luteal (Day 24)">
      <ProgressBar label="Oestrogen - declining" value="35%" percent={35} color="#7C3AED" />
      <ProgressBar label="Progesterone - falling" value="55%" percent={55} color="#F97316" />
      <ProgressBar label="LH - baseline" value="20%" percent={20} color="#185FA5" />
      <ProgressBar label="FSH - rising" value="30%" percent={30} color={Colors.accent} />
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Cortisol is elevated in the late luteal phase.</AppText> Combined with falling progesterone (which normally opposes cortisol), this creates the anxiety, irritability, and sleep disruption characteristic of PMS. Magnesium and ashwagandha can modulate this.</InsightRow>
    </Card>
    <Card icon="clipboard-outline" iconBg="#185FA5" title="Hormone tests - what to request & when" sub="Optimal timing for accurate results">
      <View style={st.tableCard}>
        <View style={st.tableHdr}>
          <AppText variant="subtext" color={Colors.blueText} style={{flex: 2, fontWeight: '700', textTransform: 'uppercase'}}>Test</AppText>
          <AppText variant="subtext" color={Colors.blueText} style={{flex: 2, fontWeight: '700', textTransform: 'uppercase'}}>Best time</AppText>
          <AppText variant="subtext" color={Colors.blueText} style={{flex: 3, fontWeight: '700', textTransform: 'uppercase'}}>What it shows</AppText>
        </View>
        {[
          ['FSH & LH', 'Day 2-4', 'Ovarian reserve, PCOS (LH:FSH ratio)'],
          ['Oestradiol (E2)', 'Day 2-4', 'Baseline oestrogen, ovarian function'],
          ['Progesterone', 'Day 21 (7 DPO)', 'Confirms ovulation occurred'],
          ['AMH', 'Any day', 'Ovarian reserve (fertility planning)'],
          ['Free testosterone', 'Day 2-4', 'PCOS, hyperandrogenism screening'],
          ['DHEAS', 'Day 2-4', 'Adrenal androgen source vs ovarian'],
          ['TSH', 'Any day (AM)', 'Thyroid function (cycle regulator)'],
          ['Prolactin', 'Day 2-4 (AM)', 'Pituitary function, cycle disruption'],
        ].map(([test, time, shows], i) => (
          <View key={i} style={st.tableRow}>
            <AppText variant="small" color={Colors.textPrimary} style={{flex: 2, fontWeight: '600'}}>{test}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{flex: 2}}>{time}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{flex: 3}}>{shows}</AppText>
          </View>
        ))}
      </View>
    </Card>
    <Card icon="leaf-outline" iconBg={Colors.accent} title="Hormonal balance - lifestyle actions" sub="Evidence-based interventions for cycle health">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Seed cycling supports hormonal metabolism.</AppText> Follicular phase (Days 1-14): 1 tbsp each flaxseeds + pumpkin seeds (phytoestrogens + zinc). Luteal phase (Days 15-28): 1 tbsp each sesame + sunflower seeds (lignans + selenium). Evidence is emerging but mechanism is plausible.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Cruciferous vegetables (broccoli, cauliflower, kale) support oestrogen detoxification.</AppText> DIM (diindolylmethane) from cruciferous vegetables shifts oestrogen metabolism toward the protective 2-OH pathway. Aim for 2-3 servings daily.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Inositol (myo-inositol 4g + D-chiro-inositol 100mg daily)</AppText> is the most evidence-based supplement for insulin-resistant cycle issues. It improves ovulation, reduces androgens, and improves insulin sensitivity - directly relevant to your T2DM + cycle profile.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Reduce xenoestrogen exposure.</AppText> BPA in plastics, parabens in cosmetics, and pesticides on produce act as endocrine disruptors. Switch to glass containers, choose clean beauty products, and wash produce thoroughly. These compounds worsen insulin resistance and disrupt ovulation.</InsightRow>
    </Card>
  </View>
);

/* TAB 5: FERTILITY */
export const CycleFertilityPanel = () => (
  <View>
    <View style={st.alertBoxGreen}>
      <Icon family="Ionicons" name="checkmark-circle-outline" size={ms(16)} color={Colors.tealDark} />
      <AppText variant="caption" color={Colors.tealDark} style={{flex: 1, lineHeight: ms(18)}}><AppText style={{fontWeight: '700'}}>No fertility concerns identified.</AppText> Your regular 27-30 day cycles with consistent luteal phase length (12.5 days average) indicate healthy ovulatory function. This section provides awareness, not alarm.</AppText>
    </View>
    <Card icon="ellipse-outline" iconBg={Colors.accent} title="Ovulation & fertility window" sub="Based on your 9-cycle tracking data">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Estimated ovulation occurs on Day 14-16 of your cycle.</AppText> With a 27.8-day average cycle and 12.5-day luteal phase, ovulation is calculated at Day 15.3. Your fertile window spans Days 10-16.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Cervical mucus pattern supports ovulation.</AppText> Track for egg-white cervical mucus (EWCM) around Days 12-16. This is the most reliable body-based ovulation indicator and confirms the LH surge.</InsightRow>
      <InsightRow color="#185FA5"><AppText style={{fontWeight: '700'}}>LH test strips (OPKs) confirm ovulation timing.</AppText> Test from Day 12 onwards. A positive OPK means ovulation in 24-36 hours. Combining OPK with BBT gives the most accurate ovulation confirmation.</InsightRow>
    </Card>
    <Card icon="fitness-outline" iconBg="#F97316" title="Fertility considerations - your health profile" sub="Factors that may affect future fertility">
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>T2DM and insulin resistance can impair egg quality.</AppText> Elevated blood glucose increases oxidative stress in developing follicles. Optimising HbA1c to below 6.5% before conception is recommended by NICE guidelines.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Metformin is generally continued in early pregnancy.</AppText> It reduces miscarriage risk by 40% in insulin-resistant women. However, this decision must be made with your obstetrician - do not stop or continue without medical advice.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Topiramate must be stopped before conception.</AppText> It is Category D (positive evidence of fetal risk). Switch to a pregnancy-safe migraine preventive (propranolol or amitriptyline) at least 1 month before trying to conceive.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Start folic acid 5mg (high dose) 3 months before conception.</AppText> T2DM and Metformin both increase folate requirements. The standard 400mcg dose is insufficient for your profile - request 5mg prescription from your GP.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Your regular cycles are a strong positive fertility indicator.</AppText> Regular ovulation, adequate luteal phase, and age-appropriate cycle length suggest good reproductive function. Pre-conception planning with your healthcare team will optimise outcomes.</InsightRow>
    </Card>
    <Card icon="thermometer-outline" iconBg="#185FA5" title="BBT interpretation - your data" sub="Basal body temperature and cycle confirmation">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>BBT rise of 0.3-0.5 degrees C after ovulation confirms progesterone production.</AppText> Your data shows a consistent thermal shift on Days 15-16, correlating with your estimated ovulation day. This biphasic pattern confirms ovulatory cycles.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>BBT drops 1-2 days before menstruation</AppText> as progesterone falls. A sustained elevated BBT beyond Day 28 can be an early pregnancy indicator (before a missed period).</InsightRow>
      <InsightRow color="#185FA5"><AppText style={{fontWeight: '700'}}>For accurate BBT:</AppText> Measure at the same time daily, before getting out of bed, after at least 3 hours of sleep. Oral temperature is sufficient. Illness, alcohol, and poor sleep can cause false elevations - note these on your chart.</InsightRow>
    </Card>
  </View>
);

const st = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(15), borderWidth: 0.5, borderColor: '#ccdaeb', marginBottom: vs(9), overflow: 'hidden'},
  cardHdr: {flexDirection: 'row', alignItems: 'center', gap: s(9), padding: ms(12), borderBottomWidth: 0.5, borderBottomColor: '#EEF3FE'},
  cardIcon: {width: ms(34), height: ms(34), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  cardBody: {padding: ms(12)},
  badge: {paddingHorizontal: s(9), paddingVertical: vs(2), borderRadius: ms(8)},
  insightRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(9), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#f2f6fb'},
  insightDot: {width: ms(7), height: ms(7), borderRadius: ms(4), marginTop: vs(5)},
  alertBoxAmber: {backgroundColor: Colors.amberBg, borderRadius: ms(12), borderWidth: 1, borderColor: '#F0B429', padding: ms(11), marginBottom: vs(9), flexDirection: 'row', alignItems: 'flex-start', gap: s(9)},
  alertBoxGreen: {backgroundColor: Colors.tealBg, borderRadius: ms(12), borderWidth: 1, borderColor: Colors.accent, padding: ms(11), marginBottom: vs(9), flexDirection: 'row', alignItems: 'flex-start', gap: s(9)},
  infoBox: {backgroundColor: Colors.blueBg, borderRadius: ms(10), padding: ms(10), marginTop: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},
  progressTrack: {height: ms(6), backgroundColor: '#EEF3FE', borderRadius: ms(3), overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: ms(3)},
  tableCard: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#ccdaeb', overflow: 'hidden'},
  tableHdr: {flexDirection: 'row', backgroundColor: '#EEF3FE', padding: ms(7), paddingHorizontal: s(12), gap: s(4), borderBottomWidth: 0.5, borderBottomColor: '#ccdaeb'},
  tableRow: {flexDirection: 'row', padding: ms(8), paddingHorizontal: s(12), borderBottomWidth: 0.5, borderBottomColor: '#e8f0f8', gap: s(4)},
});
