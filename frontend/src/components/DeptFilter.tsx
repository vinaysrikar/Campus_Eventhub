import { departments, Department, deptColorMap } from '@/lib/data';
import { motion } from 'framer-motion';

interface Props {
  selected: Department | 'ALL';
  onSelect: (d: Department | 'ALL') => void;
}

export const DeptFilter = ({ selected, onSelect }: Props) => (
  <div className="flex flex-wrap gap-2.5 justify-center">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect('ALL')}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${selected === 'ALL' ? 'gradient-primary text-primary-foreground shadow-lg glow-primary' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
    >
      All Departments
    </motion.button>
    {departments.map((d, i) => (
      <motion.button
        key={d.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(d.id)}
        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${selected === d.id ? `${deptColorMap[d.id]} text-primary-foreground shadow-lg` : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
      >
        {d.name}
      </motion.button>
    ))}
  </div>
);
