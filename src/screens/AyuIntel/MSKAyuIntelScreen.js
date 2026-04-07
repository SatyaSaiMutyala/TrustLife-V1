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
      <View style={{flex: 1}}><AppText variant="bodyBold" color={Colors.textPrimary}>{title}</AppText>{sub ? <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{sub}</AppText> : null}</View>
      {badge && <View style={[st.badge, {backgroundColor: badgeBg}]}><AppText variant="subtext" color={badgeColor} style={{fontWeight: '700'}}>{badge}</AppText></View>}
    </View>
    <View style={st.cardBody}>{children}</View>
  </View>
);

const AlertBox = ({bgColor, borderColor, iconName, iconColor, textColor, children}) => (
  <View style={[st.alertBox, {backgroundColor: bgColor, borderColor}]}>
    <Icon family="Ionicons" name={iconName} size={ms(16)} color={iconColor} />
    <AppText variant="caption" color={textColor} style={{flex: 1, lineHeight: ms(17)}}>{children}</AppText>
  </View>
);

const BarProgress = ({label, value, color, width}) => (
  <View style={{marginBottom: vs(10)}}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(3)}}>
      <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{label}</AppText>
      <AppText variant="caption" color={color} style={{fontWeight: '700'}}>{value}</AppText>
    </View>
    <View style={st.barWrap}><View style={[st.barFill, {width, backgroundColor: color}]} /></View>
  </View>
);

/* ====================================== */
/* TAB 1: OVERVIEW                        */
/* ====================================== */
export const MSKOverviewPanel = () => (
  <View>
    <AlertBox bgColor="#FEF0F0" borderColor="#FDA4A4" iconName="warning" iconColor="#E24B4A" textColor="#7F1D1D">
      <AppText style={{fontWeight: '700'}}>Swelling + inability to weight-bear is a red flag.</AppText> This combination warrants same-day or next-day medical assessment - not just rest and ice. Please contact Dr. Kavitha or a physiotherapist before this worsens.
    </AlertBox>

    <Card icon="body-outline" iconBg="#F97316" title="Left knee - pattern analysis" sub="3-week worsening trend - mechanical pattern" badge="Review needed" badgeBg="#FFF7ED" badgeColor="#92400E">
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Worsening trajectory:</AppText> Pain score progression 4 - 4 - 7 - 5 over 3 weeks, with increasing swelling and now nocturnal pain. Nocturnal joint pain that wakes you from sleep is clinically significant and differentiates inflammatory from purely mechanical causes.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Crepitus (clicking) + swelling</AppText> together most commonly indicate meniscal irritation, early osteoarthritis, or bursitis. At 38 with T2DM, early OA is plausible - T2DM accelerates cartilage degradation through AGE (advanced glycation end-product) accumulation.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Mechanical triggers:</AppText> Uneven ground walking and prolonged standing are your consistent triggers. This points toward patellofemoral joint stress or medial compartment load - not systemic inflammatory arthritis, which is not activity-dependent.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Pain-free days exist:</AppText> 12 pain-free days this month confirms this is not constant-inflammatory. Rest and ice consistently help. This is a positive prognostic sign - structural damage is likely limited at this stage.</InsightRow>
    </Card>

    <Card icon="body-outline" iconBg={Colors.blueText} title="Lower back - pattern" sub="Postural / mechanical - moderate risk">
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Desk-posture correlation:</AppText> Every lower back entry follows prolonged sitting. This is classic mechanical lower back pain (MLBP) - the most common MSK complaint globally, affecting 80% of adults. Your lumbar lordosis is likely flattening during prolonged sitting, loading the posterior facet joints.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>No red flags in back:</AppText> Pain is activity-related, unilateral, and not waking you at night (unlike the knee). No neurological symptoms. Low risk for serious pathology - high probability of postural overload responding well to ergonomic and movement intervention.</InsightRow>
    </Card>

    <Card icon="flag-outline" iconBg={Colors.accent} title="Priority actions this week" sub="">
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Knee: Book a physiotherapy assessment within 5 days.</AppText> Swelling + crepitus + nocturnal pain at 38 with T2DM warrants clinical examination. A physiotherapist can differentiate meniscal, OA, or bursitis without imaging in most cases.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Temporarily avoid uneven terrain and prolonged standing.</AppText> This is load management, not permanent avoidance. 5-7 days of modified activity prevents the cycle of re-aggravation.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Back: Set a 30-minute standing/movement reminder</AppText> during desk work. Standing for 5 minutes every 30 minutes reduces lumbar pressure by 40% compared to continuous sitting.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Aquatic exercise</AppText> (pool walking, swimming) maintains cardiovascular fitness and blood glucose control while dramatically reducing knee joint load during the recovery period.</InsightRow>
    </Card>
  </View>
);

/* ====================================== */
/* TAB 2: CONDITIONS                      */
/* ====================================== */
export const MSKConditionsPanel = () => (
  <View>
    <Card icon="fitness-outline" iconBg="#F97316" title="Osteoarthritis (OA) - risk assessment" sub="Most likely diagnosis for left knee pattern" badge="Moderate risk" badgeBg="#FFF7ED" badgeColor="#92400E">
      <BarProgress label="OA risk profile" value="5/8 factors" color="#F97316" width="62%" />
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Risk factors present:</AppText> Age 38 (OA onset accelerates post-35), female sex (2x higher OA risk), T2DM (AGE-driven cartilage damage), crepitus on movement, and pain worse on weight-bearing and stairs. These are the Rotterdam OA criteria.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>T2DM accelerates OA</AppText> through three mechanisms: (1) AGE accumulation stiffens cartilage collagen, (2) chronic low-grade inflammation (IL-6, TNF-a) degrades proteoglycans, and (3) hyperglycaemia reduces chondrocyte survival. Better HbA1c directly slows OA progression.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Early OA is highly manageable</AppText> - exercise therapy, weight management, and joint protection reduce progression. The goal is not to avoid movement but to load the joint intelligently. Cartilage needs mechanical stimulation to remain healthy.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Diagnosis confirmation:</AppText> X-ray (weight-bearing AP and lateral views) can show joint space narrowing. MRI is more sensitive for early cartilage loss. Ask for both if your physiotherapist suspects OA after clinical examination.</InsightRow>
    </Card>

    <Card icon="flame-outline" iconBg="#E24B4A" title="Rheumatoid arthritis - monitoring" sub="Inflammatory arthritis - screen periodically">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>RA affects 0.5-1% of adults</AppText>, is more common in women, and often begins in the 30s-50s. Unlike OA, RA is symmetric (affects both knees equally), causes prolonged morning stiffness ({'>'} 1 hour), and produces systemic symptoms (fatigue, low-grade fever). Your pattern is asymmetric and activity-dependent - more consistent with OA.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Screen if any of the following develop:</AppText> Symmetric joint swelling in small joints (fingers, wrists), morning stiffness lasting more than 45 minutes, fatigue out of proportion to your anaemia, or elevated ESR/CRP on blood work. RA blood tests: RF and anti-CCP antibodies.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>T2DM and RA co-occurrence</AppText> is well-documented - shared inflammatory pathways (TNF-a, IL-6) drive both conditions. If RA is ever diagnosed, the biologic drugs used for treatment (TNF inhibitors) also improve insulin sensitivity.</InsightRow>
    </Card>

    <Card icon="pulse-outline" iconBg="#7C3AED" title="Fibromyalgia awareness" sub="Widespread pain + fatigue pattern">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Fibromyalgia affects 2-8% of the population,</AppText> predominantly women aged 30-55. It is characterised by widespread musculoskeletal pain, fatigue, sleep disturbance, and cognitive symptoms ("fibro fog"). Crucially, it is a central sensitisation syndrome - the pain is real and physiological, but driven by the nervous system, not tissue damage.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Your stress and mood data shows high PHQ-9 and GAD-7 scores,</AppText> chronic stress, poor sleep, and widespread fatigue - all fibromyalgia risk factors. Depression and anxiety are present in 60-70% of fibromyalgia cases. This does not mean your joint pain is not real - it means the pain experience is amplified by central sensitisation.</InsightRow>
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Watch for:</AppText> Pain spreading beyond the knee and back to multiple body regions, tenderness at specific trigger points, pain that varies with mood and sleep quality, and no inflammatory markers on blood tests (ESR, CRP normal).</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Treatment:</AppText> Low-impact aerobic exercise is the most evidence-based treatment for fibromyalgia (reduces pain by 30-40%). CBT, sleep improvement, and duloxetine are effective. Opioids and NSAIDs are largely ineffective for fibromyalgia.</InsightRow>
    </Card>

    <Card icon="flash-outline" iconBg="#D97316" title="Gout - elevated risk" sub="T2DM + hypertension = gout risk profile">
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Your profile has 3 major gout risk factors:</AppText> T2DM (insulin resistance impairs uric acid excretion), hypertension (urate retention), and Olmesartan (ARBs are mostly urate-neutral but diuretics - if ever added - dramatically raise uric acid). Gout classically presents as sudden, severe, red, hot, swollen joint pain - often the big toe, but can affect the knee.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>If knee pain ever becomes sudden-onset, intensely hot, red, and exquisitely tender at rest,</AppText> consider gout as the cause. A serum uric acid level and joint fluid analysis (if accessible) can differentiate. Gout and OA can co-exist in the same joint.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Prevention:</AppText> Stay well-hydrated (reduces uric acid crystallisation), limit red meat and shellfish (purines), reduce fructose (raises uric acid), and maintain physical activity. Vitamin C supplementation reduces uric acid by a modest but meaningful amount.</InsightRow>
    </Card>

    <Card icon="fitness-outline" iconBg={Colors.accent} title="Osteoporosis - proactive monitoring" sub="Risk window starting age 35-40">
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Peak bone mass is achieved by age 30</AppText>, then declines. Women lose bone mass 3x faster than men after menopause. At 38, you are approaching the window where early preventive action matters most. Iron deficiency anaemia and poor nutrition (common with T2DM dietary management) can impair bone mineralisation.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Risk factors in your profile:</AppText> Female, South Indian diet (often low in dairy calcium), T2DM (linked to higher fracture risk despite normal BMD due to impaired bone quality), and iron deficiency (impairs collagen cross-linking in bone matrix).</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Protective actions now:</AppText> Weight-bearing exercise (walking, resistance training) builds bone density - even 20 minutes 3x per week. Calcium 1000mg daily (preferably from food - sesame seeds, ragi, dairy). Vitamin D 2000 IU daily (most Indians are deficient). Request DEXA scan at your next annual check.</InsightRow>
    </Card>

    <Card icon="medical-outline" iconBg={Colors.blueText} title="Tendinopathy & plantar fasciitis" sub="Overuse and metabolic risk">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>T2DM increases tendon vulnerability</AppText> through the same AGE mechanism as cartilage. Tendons become stiffer, less elastic, and more prone to micro-tears. Patellar tendinopathy (below kneecap pain with activity) and Achilles tendinopathy (heel pain, worse in the morning) are common in T2DM patients.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Plantar fasciitis</AppText> (heel pain, worst with first steps in the morning) affects up to 25% of T2DM patients. Your anaemia and fatigue may lead to altered gait mechanics that increase plantar fascia load. If you develop morning heel pain, eccentric heel drops and orthotics are first-line treatment.</InsightRow>
    </Card>
  </View>
);

/* ====================================== */
/* TAB 3: CORRELATIONS                    */
/* ====================================== */
export const MSKCorrelationsPanel = () => (
  <View>
    <Card icon="water-outline" iconBg="#F97316" title="T2DM - MSK correlations" sub="Strongest driver in your profile">
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Hyperglycaemia degrades cartilage directly.</AppText> AGEs (advanced glycation end-products) accumulate in cartilage collagen at rates proportional to HbA1c. At HbA1c 7.8%, your cartilage is ageing approximately 30% faster than at normal glucose levels. Every 1% reduction in HbA1c measurably reduces OA progression rate.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Chronic low-grade inflammation</AppText> (elevated CRP, IL-6) in T2DM simultaneously damages synovial tissue and increases pain sensitivity. This explains why pain control is harder in T2DM patients - the inflammatory background lowers your pain threshold.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>MSK pain reduces physical activity,</AppText> which raises blood glucose. This creates a reinforcing loop: pain - less walking - higher glucose - more AGE accumulation - more pain. Breaking this cycle through aquatic or upper-body exercise during knee recovery is essential.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Joint pain after glucose spikes:</AppText> Some patients notice knee and joint aching 1-2 hours after high-carbohydrate meals, corresponding to the inflammatory cytokine surge that follows hyperglycaemia. Tracking meal timing alongside pain may reveal this pattern in your logs.</InsightRow>
    </Card>

    <Card icon="scale-outline" iconBg={Colors.accent} title="Weight & joint load correlations" sub="Every kg matters for knee health">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Each kilogram of body weight</AppText> exerts 4-6 kg of force on the knee joint during walking. At 63.2 kg (your logged weight), your knees absorb approximately 280-380 kg per step. A 5% weight reduction (3.2 kg) would reduce knee load by 13-19 kg per step - clinically meaningful for OA progression and pain.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Even modest weight loss (5-10%)</AppText> reduces knee OA pain by 30-50% in clinical studies. Diet modification and aquatic exercise (which loads knees at 20% of body weight in chest-deep water) are the most effective dual intervention for your situation.</InsightRow>
    </Card>

    <Card icon="moon-outline" iconBg="#7C3AED" title="Sleep - Pain correlations" sub="Bidirectional, underrecognised">
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Pain disrupts sleep; poor sleep amplifies pain.</AppText> Sleep deprivation reduces pain threshold by up to 30% through reduced opioid receptor sensitivity and elevated inflammatory cytokines. Your 5.8-hour sleep average, combined with knee pain disrupting sleep, creates a pain amplification loop.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Your entries where nocturnal pain is logged</AppText> correlate with higher next-day pain scores (avg 6.1 vs 4.2 on non-disturbed nights). Treating the sleep disruption is part of treating the pain - this is not just correlation.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Pillow positioning for knee pain:</AppText> Sleeping on your side with a pillow between your knees reduces medial compartment load and femoral internal rotation. Avoiding stomach sleeping prevents lumbar hyperextension. These small changes reduce nocturnal pain without medication.</InsightRow>
    </Card>

    <Card icon="medkit-outline" iconBg={Colors.blueText} title="Medication - MSK correlations" sub="Your current medications">
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>NSAIDs (Ibuprofen for period pain):</AppText> Short-term NSAID use is appropriate for acute musculoskeletal pain but should not exceed 7 days without medical guidance in the context of T2DM. NSAIDs reduce renal blood flow - especially relevant with Metformin, which requires adequate kidney function for safe elimination. Stay well-hydrated on NSAID days.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Olmesartan (ARB):</AppText> Some ARBs have mild anti-inflammatory properties. Olmesartan specifically has shown cartilage-protective effects in animal studies through AT1 receptor blockade in chondrocytes. This is a potential benefit, not yet standard practice.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Metformin and OA:</AppText> Emerging evidence (Ma et al., 2022) suggests Metformin may slow OA progression by reducing chondrocyte senescence through AMPK activation - the same mechanism by which it improves insulin sensitivity. Your Metformin may be providing modest joint protection.</InsightRow>
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Avoid corticosteroid injections frequently:</AppText> Repeated intra-articular corticosteroids accelerate cartilage breakdown. For OA, hyaluronic acid injections are a better long-term strategy if conservative management fails. Discuss with an orthopaedic surgeon.</InsightRow>
    </Card>

    <Card icon="happy-outline" iconBg="#E24B4A" title="Stress & mood - Pain" sub="Central sensitisation in your data">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Your highest pain days (6-7/10)</AppText> overlap significantly with your highest-stress days on the mood log. This is not psychological - it is physiological. Cortisol at high levels increases pain sensitivity, reduces anti-inflammatory prostaglandins, and delays tissue healing.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Catastrophising</AppText> (a cognitive pattern of magnifying pain significance) raises pain intensity scores by an average of 2 points on validated scales. Your guilt and overwhelm entries in the mood log may be amplifying perceived knee pain. This is not a dismissal of your pain - it is an opportunity: treating depression and anxiety will measurably reduce pain.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Mindfulness-Based Stress Reduction (MBSR)</AppText> reduces chronic pain severity by 30-50% through top-down regulation of the anterior cingulate cortex (the brain's pain volume control). This is especially powerful in the T2DM + depression + pain triad you are navigating.</InsightRow>
    </Card>
  </View>
);

/* ====================================== */
/* TAB 4: CARE PLAN                       */
/* ====================================== */
export const MSKCarePlanPanel = () => (
  <View>
    <Card icon="walk-outline" iconBg={Colors.accent} title="Exercise prescription - your profile" sub="Evidence-based - safe for T2DM + knee pain">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Aquatic exercise (pool walking/swimming):</AppText> Best current option. Buoyancy reduces knee load by 75-80% in chest-deep water while maintaining cardiovascular benefit. 30 minutes, 4x per week. Significantly improves OA pain and blood glucose simultaneously.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Quadriceps strengthening:</AppText> Every 1kg increase in quadriceps strength reduces knee OA pain by 20%. Seated leg raises (foot off ground), mini-squats to 30 degrees, and straight-leg raises are safe at your pain level. 3 sets of 12, daily. This is the most evidence-based intervention for knee OA.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Cycling (stationary):</AppText> Non-weight-bearing, maintains knee range of motion, and improves blood glucose. Start with low resistance and seat height adjusted so knee bends only 70-80 degrees maximum. 20 minutes daily.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Temporarily avoid:</AppText> Running, jumping, deep squats, lunges, and kneeling until the acute swelling resolves. These activities load the patellofemoral joint and meniscus beyond what your current inflammation can tolerate.</InsightRow>
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Never completely stop moving.</AppText> Complete rest causes muscle atrophy, which reduces joint stability and accelerates OA. The goal is load management - intelligent movement, not immobility.</InsightRow>
    </Card>

    <Card icon="scan-outline" iconBg="#7C3AED" title="When to seek imaging" sub="Clinical decision guide">
      <View style={st.tableCard}>
        <View style={st.tableHeader}>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.tableHeaderTxt, {flex: 1}]}>Imaging type</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.tableHeaderTxt, {flex: 1}]}>When warranted</AppText>
        </View>
        {[
          ['X-ray (knee)', 'Swelling + pain >4 weeks, suspected OA/fracture'],
          ['MRI (knee)', 'Meniscal/ligament suspected, locking or giving way'],
          ['Ultrasound', 'Soft tissue - bursitis, tendinopathy, effusion check'],
          ['X-ray (lumbar)', 'Back pain >6 weeks, not responding to conservative care'],
          ['DEXA scan', 'Bone density - annually from age 40, or sooner if OA confirmed'],
        ].map(([type, when], i) => (
          <View key={i} style={st.tableRow}>
            <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, fontWeight: '600'}}>{type}</AppText>
            <AppText variant="caption" color="#555" style={{flex: 1}}>{when}</AppText>
          </View>
        ))}
      </View>
      <AppText variant="subtext" color={Colors.textSecondary} style={{fontStyle: 'italic', marginTop: vs(6)}}>Imaging does not replace clinical examination. A physiotherapist or orthopaedic surgeon should guide imaging decisions based on history and examination findings.</AppText>
    </Card>

    <Card icon="flask-outline" iconBg={Colors.accent} title="Blood tests to request" sub="At next Dr. Kavitha appointment">
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>ESR + CRP:</AppText> Inflammatory markers. Normal ESR/CRP in the context of joint pain strongly supports mechanical (OA/tendinopathy) rather than inflammatory (RA, gout) cause. If elevated, further investigation warranted.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Serum uric acid:</AppText> Screen for gout given your T2DM + HTN profile. A level {'>'}6.8 mg/dL in a symptomatic joint warrants gout consideration, even if pain character differs from classic presentation.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>RF + anti-CCP:</AppText> Rheumatoid factor and anti-cyclic citrullinated peptide antibodies. If RA is a clinical concern after physiotherapy examination, these tests differentiate RA from other inflammatory arthritis.</InsightRow>
      <InsightRow color={Colors.blueText}><AppText style={{fontWeight: '700'}}>Vitamin D (25-OH):</AppText> Deficiency is near-universal in urban Indians and causes widespread musculoskeletal pain, myalgia, and bone pain that mimics OA and fibromyalgia. A level below 20 ng/mL should be aggressively repleted with 4000-6000 IU daily for 8 weeks.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Calcium + PTH:</AppText> Hypocalcaemia causes muscle cramps and joint pain. Hyperparathyroidism (a consequence of untreated Vitamin D deficiency) causes bone pain and can mimic OA on X-ray.</InsightRow>
    </Card>

    <Card icon="leaf-outline" iconBg="#D97316" title="Nutrition for joint health" sub="Anti-inflammatory eating for T2DM + OA">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Omega-3 fatty acids</AppText> (fatty fish - salmon, mackerel, sardines; flaxseeds; walnuts) reduce synovial inflammation and joint pain with an effect comparable to low-dose NSAIDs. 2g of EPA+DHA daily is the therapeutic dose. Fish oil supplements are a practical option.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Turmeric (curcumin 500mg twice daily)</AppText> has meta-analytic evidence for knee OA pain reduction comparable to ibuprofen at 12 weeks (Kuptniratsaikul et al., 2014). Bioavailability is poor without piperine - combine with black pepper or use a phospholipid-formulated supplement.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Collagen peptides (10g daily)</AppText> increase synovial fluid collagen synthesis and reduce OA pain in randomised trials. Best taken with vitamin C (required for collagen cross-linking). Bone broth is a traditional alternative. Safe alongside your current medications.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Reduce processed sugar and refined carbohydrates:</AppText> Advanced glycation end-products form not just internally but are also consumed pre-formed in heavily processed, high-temperature cooked foods. Reducing these reduces both HbA1c and cartilage AGE accumulation simultaneously.</InsightRow>
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Avoid:</AppText> Red meat (raises uric acid and systemic inflammation), excess salt (worsens hypertension which compounds MSK problems), and alcohol (disrupts uric acid excretion and worsens sleep quality, both of which worsen joint pain).</InsightRow>
    </Card>

    <Card icon="people-outline" iconBg={Colors.blueText} title="Specialist referral guide" sub="Who to see and when">
      <InsightRow color="#E24B4A"><AppText style={{fontWeight: '700'}}>Physiotherapist (now):</AppText> First-line for knee pain with swelling and clicking. Clinical examination can diagnose most MSK conditions without imaging. In Hyderabad: Apollo Hospitals MSK physiotherapy, KIMS, or CARE Hospitals have specialist physiotherapy units.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Orthopaedic surgeon (if physio confirms OA or meniscal injury):</AppText> For imaging guidance, injection therapy, or surgical assessment if conservative management fails at 6 weeks. Request a knee-specialising orthopaedic surgeon.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Rheumatologist (if RA/inflammatory arthritis suspected):</AppText> Refer if blood markers (RF, anti-CCP, CRP) are elevated or if joint pattern becomes symmetric and systemic. Rheumatology + Endocrinology co-management is ideal for T2DM + inflammatory arthritis.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Sports medicine physician:</AppText> An excellent alternative to orthopaedics for non-surgical MSK conditions. They specialise in exercise-based rehabilitation and are well-versed in managing active patients with metabolic conditions. Apollo and KIMS both have sports medicine departments in Hyderabad.</InsightRow>
    </Card>
  </View>
);

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(15), borderWidth: 0.5, borderColor: '#E5DDD3', marginBottom: vs(9), overflow: 'hidden'},
  cardHdr: {flexDirection: 'row', alignItems: 'center', gap: s(9), padding: ms(12), borderBottomWidth: 0.5, borderBottomColor: '#F3F1ED'},
  cardIcon: {width: ms(34), height: ms(34), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  cardBody: {padding: ms(12)},
  badge: {paddingHorizontal: s(9), paddingVertical: vs(3), borderRadius: ms(8)},

  insightRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(9), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: Colors.background},
  insightDot: {width: ms(7), height: ms(7), borderRadius: ms(4), marginTop: vs(5)},

  alertBox: {borderRadius: ms(12), borderWidth: 1, padding: ms(13), marginBottom: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(9)},

  barWrap: {height: ms(9), backgroundColor: '#F0EDE8', borderRadius: ms(5), overflow: 'hidden'},
  barFill: {height: '100%', borderRadius: ms(5)},

  tableCard: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#E5DDD3', overflow: 'hidden', marginBottom: vs(8)},
  tableHeader: {flexDirection: 'row', backgroundColor: '#F3F1ED', paddingVertical: vs(7), paddingHorizontal: s(12), borderBottomWidth: 0.5, borderBottomColor: '#E5DDD3', gap: s(6)},
  tableHeaderTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3},
  tableRow: {flexDirection: 'row', paddingVertical: vs(8), paddingHorizontal: s(12), borderBottomWidth: 0.5, borderBottomColor: '#F3F1ED', gap: s(6)},
});

export default {MSKOverviewPanel, MSKConditionsPanel, MSKCorrelationsPanel, MSKCarePlanPanel};
