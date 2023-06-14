import sys
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime
from scipy.interpolate import make_interp_spline

# Get the array of numbers from command-line arguments
args = sys.argv[1:]

num_array = sys.argv[1].split(',')

num_array = [int(num) for num in num_array]  # Convert string elements to integers

labels = sys.argv[2].split(',')
user = args[2]
userName = args[3]
target_month = args[4]  # User-provided month

average_value = sum(num_array) / len(num_array)

average_values = np.full(len(num_array), average_value)  # Create an array with all values set to the average

if target_month == "null":
    
    years = np.arange(2020, 2020 + len(num_array))

    # Smoothing the line with spline interpolation
    spline = make_interp_spline(years, num_array)
    years_smooth = np.linspace(years.min(), years.max(), 300)  # Increase 300 for a smoother curve
    nums_smooth = spline(years_smooth)

    # Plotting
    plt.figure(figsize=(8, 6))  # Adjust the figure size as per your preference
    plt.plot(years_smooth, nums_smooth, linewidth=2)  # Solid curved line with thick linewidth
    plt.fill_between(years_smooth, nums_smooth, color='skyblue', alpha=0.4)  # Fill the area under the curve
    plt.xticks([])  # Hide x-axis labels
    plt.yticks(np.arange(1, 6))  # Show y-axis labels from 1 to 5
    plt.xlabel('Year', fontsize=12)  # x-axis label
    plt.ylabel('Value', fontsize=12)  # y-axis label
    plt.title('Data Plot', fontsize=14)  # Plot title

    plt.show()

    date_labels = [datetime.strptime(date, "%m/%d/%Y") for date in labels]
    month_labels = [date.strftime("%B").lower() for date in date_labels]

    # Specify the target month based on user input
    month_indices = range(len(month_labels))
    month_values = num_array
    month_average = average_value  # Assuming the average value is calculated from all the data
    month_x = [i + 1 for i in month_indices]

    # Generate the graph
    num_data_points = len(month_indices)
    min_fig_width = 10
    fig_width = max(min_fig_width, num_data_points * 0.2)
    fig, ax = plt.subplots(figsize=(fig_width, 32))  # Adjust the figsize as needed

    # Smooth curve using spline interpolation
    x_interp = np.linspace(month_x[0], month_x[-1], 1000)
    y_interp = np.interp(x_interp, month_x, month_values)

    ax.plot(x_interp, y_interp, color='blue', linestyle='-', linewidth=3, label=f"Mood Data (Full Year)")
    ax.plot(month_x, [month_average] * len(month_indices), color="red", linestyle="--", linewidth=3, label=f"Average Value (Full Year)")

    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_title(userName + "'s Mood Plot (Full Year)")
    ax.legend()  # Show legend with plot labels

    ax.set_xticks(month_x)
    ax.set_xticklabels(labels, rotation=45)  # Rotate x-axis labels by 45 degrees

    ax.set_ylim(1, 5)  # Adjust the y-axis limits to include the average line
    ax.set_yticks(range(1, 5, 1))

    ax.grid(True)

    file_name = user + 'graph.png'
    save_directory = 'helperFunctions/graphImages/'
    save_path = save_directory + file_name

    plt.savefig(save_path)

    sys.exit(0)

# Split labels by months
date_labels = [datetime.strptime(date, "%m/%d/%Y") for date in labels]
month_labels = [date.strftime("%B").lower() for date in date_labels]

print(args[-1])

# Specify the target month based on user input
month_indices = [i for i, m in enumerate(month_labels) if m == target_month]
month_values = [num_array[i] for i in month_indices]
month_average = average_value  # Assuming the average value is calculated from all the data
month_x = [i + 1 for i in month_indices]

# Generate the graph
num_data_points = len(month_indices)
min_fig_width = 10
fig_width = max(min_fig_width, num_data_points * 0.2)
fig, ax = plt.subplots(figsize=(fig_width, 8))  # Adjust the figsize as needed

ax.plot(month_x, month_values, color='blue', linestyle='-', linewidth=3, marker='o', markersize=8, label=f"Mood Data ({target_month})")
ax.plot(month_x, [month_average] * len(month_indices), color="red", linestyle="--", linewidth=3, label=f"Average Value ({target_month})")

ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_title(userName + "'s " + target_month + " Mood Plot")
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