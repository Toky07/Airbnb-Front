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
    <div className="inline-flex rounded-2xl border border-line bg-surface p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={[
            'rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200',
            value === option.value
              ? 'bg-brand text-white'
              : 'text-ink/60 hover:bg-mist',
          ].join(' ')}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;
