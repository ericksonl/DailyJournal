import sys
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

# Get the array of numbers from command-line arguments
args = sys.argv[1:]

num_array = sys.argv[1].split(',')

num_array = [int(num) for num in num_array]  # Convert string elements to integers

labels = sys.argv[2].split(',')
user = args[2]
userName = args[3]

average_value = sum(num_array) / len(num_array)

average_values = np.full(len(num_array), average_value)  # Create an array with all values set to the average

# Split labels by months
date_labels = [datetime.strptime(date, "%m/%d/%Y") for date in labels]
month_labels = [date.strftime("%B") for date in date_labels]
unique_months = list(set(month_labels))

print(args[-1])

# Specify the target month based on user input
target_month = args[4]  # User-provided month
month_indices = [i for i, m in enumerate(month_labels) if m == target_month]
month_values = [num_array[i] for i in month_indices]
month_average = average_value  # Assuming the average value is calculated from all the data
month_x = [i + 1 for i in month_indices]

# Generate the graph
fig, ax = plt.subplots(figsize=(10, 8))  # Adjust the figsize as needed

ax.plot(month_x, month_values, color='blue', linestyle='-', linewidth=3, marker='o', markersize=8, label=f"Mood Data ({target_month})")
ax.plot(month_x, [month_average] * len(month_indices), color="red", linestyle="--", linewidth=3, label=f"Average Value ({target_month})")

ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_title(userName + "'s Mood Plot")
ax.legend()  # Show legend with plot labels

ax.set_xticks(month_x)
ax.set_xticklabels([labels[i] for i in month_indices], rotation=45)  # Rotate x-axis labels by 45 degrees

ax.set_ylim(1, 6)  # Adjust the y-axis limits to include the average line

ax.set_yticks(range(1, 6, 1))

ax.grid(True)

file_name = user + 'graph.png'

save_directory = 'helperFunctions/graphImages/'
save_path = save_directory + file_name

plt.savefig(save_path)

sys.exit(0)