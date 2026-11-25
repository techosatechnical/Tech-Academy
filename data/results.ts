import { StudentResult } from '@/types';

export const academicStats = [
  { value: '98.6%', label: 'Top Score (State / Board)', description: 'Highest score recorded in the previous board session' },
  { value: '180+', label: 'Distinction Achievers', description: 'Scored 90% and above in Board Examinations' },
  { value: '100%', label: 'Pass Rate Consistency', description: 'Consecutive track record across high school batches' },
  { value: '45+', label: 'Competitive Ranks', description: 'Students qualifying in top regional and national test rankings' },
];

export const studentResultsData: StudentResult[] = [
  {
    id: 'res-1',
    studentName: 'Aarav Nair',
    classLevel: 'Class 12 (Plus Two)',
    examination: 'State Higher Secondary Board',
    score: '98.8%',
    percentileOrRank: 'State Rank 4',
    academicYear: '2025 – 2026',
    achievementHighlight: 'Centum 100/100 in Mathematics & Physics. Admitted to top government engineering college.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    stream: 'Science (PCMB)'
  },
  {
    id: 'res-2',
    studentName: 'Ananya S. Iyer',
    classLevel: 'Class 12 (Plus Two)',
    examination: 'CBSE Class XII Board',
    score: '98.4%',
    percentileOrRank: 'School Topper',
    academicYear: '2025 – 2026',
    achievementHighlight: 'Scored 99 in Chemistry and 100 in Biology. Cleared NEET on first attempt with 675/720.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    stream: 'Science (Biology)'
  },
  {
    id: 'res-3',
    studentName: 'Rohan Matthew',
    classLevel: 'Class 10 (SSLC / CBSE)',
    examination: 'Class 10 Board Examination',
    score: '99.2%',
    percentileOrRank: 'District 2nd Position',
    academicYear: '2025 – 2026',
    achievementHighlight: 'Full A1 grade across all 5 subjects with 100/100 in Mathematics and Social Science.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    stream: 'Secondary School'
  },
  {
    id: 'res-4',
    studentName: 'Meera Rajesh',
    classLevel: 'Class 12 (Commerce)',
    examination: 'CBSE Commerce Stream',
    score: '97.8%',
    percentileOrRank: 'Commerce Stream Topper',
    academicYear: '2025 – 2026',
    achievementHighlight: '100 in Accountancy, 98 in Economics. Successfully cleared CA Foundation with distinction.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    stream: 'Commerce'
  },
  {
    id: 'res-5',
    studentName: 'Karthik Varma',
    classLevel: 'Class 11 (Plus One)',
    examination: 'Higher Secondary Year 1 Finals',
    score: '96.5%',
    percentileOrRank: 'Batch First',
    academicYear: '2024 – 2025',
    achievementHighlight: 'Scored top marks in Physics and Chemistry; selected for National Science Olympiad regional camp.',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80',
    stream: 'Science (PCMC)'
  },
  {
    id: 'res-6',
    studentName: 'Sneha Chandran',
    classLevel: 'Class 10',
    examination: 'ICSE Board Examination',
    score: '98.0%',
    percentileOrRank: 'Top 1% Percentile',
    academicYear: '2024 – 2025',
    achievementHighlight: 'Outstanding score in Science, Mathematics and English. Received Academic Excellence Award.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    stream: 'Secondary School'
  },
  {
    id: 'res-7',
    studentName: 'Gautam Menon',
    classLevel: 'Competitive Batch',
    examination: 'JEE Main & Advanced Drill',
    score: '99.1 %ile',
    percentileOrRank: 'State Top 50',
    academicYear: '2024 – 2025',
    achievementHighlight: 'Demonstrated consistent high performance across all national-level mock tests at Tech Academy.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    stream: 'Entrance Focus'
  },
  {
    id: 'res-8',
    studentName: 'Divya Nambiar',
    classLevel: 'Class 12 (Commerce)',
    examination: 'State Higher Secondary',
    score: '97.4%',
    percentileOrRank: 'Subject Centum',
    academicYear: '2024 – 2025',
    achievementHighlight: 'Centum in Business Studies and Computer Applications with high distinction in Mathematics.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    stream: 'Commerce'
  }
];

