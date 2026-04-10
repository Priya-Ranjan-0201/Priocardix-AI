import pandas as pd
import os

data_dir = 'data/'
csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]

print(f"Analyzing {len(csv_files)} datasets...\n")

for f in csv_files:
    file_path = os.path.join(data_dir, f)
    try:
        df = pd.read_csv(file_path)
        print(f"--- {f} ---")
        print(f"Rows: {len(df)}")
        print(f"Columns: {list(df.columns)}")
        print(f"Sample:\n{df.head(1).to_string()}\n")
    except Exception as e:
        print(f"Error reading {f}: {e}")
