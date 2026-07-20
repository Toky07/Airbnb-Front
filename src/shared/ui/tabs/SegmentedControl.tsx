type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
};

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={[
            'rounded-xl px-5 py-2.5 text-sm font-semibold transition',
            value === option.value
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-50',
          ].join(' ')}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;
