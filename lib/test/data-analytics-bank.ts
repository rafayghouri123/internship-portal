import { InternalQuestion } from "@/lib/test/types";

export const dataAnalyticsQuestions: InternalQuestion[] = [
  {
    id: "data-analytics-1",
    question:
      "An HR analytics dashboard groups candidates by field type. One column stores each candidate's country name (for example, Pakistan, UAE, Saudi Arabia). Which type of data is this column?",
    options: [
      "Temperature in Celsius",
      "Number of employees",
      "Customer's country of residence",
      "Revenue in dollars"
    ],
    answer: "C"
  },
  {
    id: "data-analytics-2",
    question:
      "While reviewing internship application data, you notice that some records have empty values in the GPA field. In data terms, those empty entries are called what?",
    options: [
      "A value equal to zero",
      "A missing or undefined value",
      "A negative number",
      "The smallest value in a column"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-3",
    question:
      "You are defining a database schema for intern profiles. The field `age` must store complete years without decimals. Which data type is most suitable?",
    options: ["Boolean", "String", "Float", "Integer"],
    answer: "D"
  },
  {
    id: "data-analytics-4",
    question:
      "A machine learning model is unstable because features have very different scales. You apply a preprocessing step so values fit within a common range such as 0 to 1. This step is known as:",
    options: [
      "Removing duplicate records from a dataset",
      "Scaling data to a standard range (e.g., 0 to 1)",
      "Converting categorical data to numerical format",
      "Splitting data into training and test sets"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-5",
    question:
      "Your team moves intern records from unstructured notes into a table where each row is one intern and each column is a fixed attribute. This is best described as:",
    options: [
      "Data stored only in cloud platforms",
      "Data organized in a fixed schema such as rows and columns",
      "Data that has been cleaned and validated",
      "Unformatted text data"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-6",
    question:
      "You build an SQL report that groups applicants by university and then needs to keep only groups with more than 10 applicants. Which clause should be used after `GROUP BY`?",
    options: ["WHERE", "FILTER", "HAVING", "ORDER BY"],
    answer: "C"
  },
  {
    id: "data-analytics-7",
    question:
      "In a sales analytics review, you run `SELECT COUNT(DISTINCT customer_id) FROM orders;`. What does this return?",
    options: [
      "Total number of orders",
      "Number of unique customers who placed orders",
      "Number of duplicate customer IDs",
      "Total revenue from all orders"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-8",
    question:
      "A product manager only wants records that exist in both `customers` and `orders` tables. Which SQL join should be used?",
    options: ["LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "INNER JOIN"],
    answer: "D"
  },
  {
    id: "data-analytics-9",
    question:
      "You are summarizing monthly intern intake by department in SQL. Why would you use `GROUP BY`?",
    options: [
      "To sort results in ascending order",
      "To aggregate rows that share the same values in specified columns",
      "To remove duplicate rows from results",
      "To join two tables together"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-10",
    question:
      "A KPI report needs the highest stipend value from a column. Which SQL aggregate function gives that value?",
    options: ["SUM()", "AVG()", "MAX()", "COUNT()"],
    answer: "C"
  },
  {
    id: "data-analytics-11",
    question:
      "You need to visualize the distribution of intern test scores (a continuous variable). Which chart is most appropriate?",
    options: ["Pie chart", "Bar chart", "Histogram", "Line chart"],
    answer: "C"
  },
  {
    id: "data-analytics-12",
    question:
      "The HR head wants to see how monthly applications changed over the last 12 months. Which chart should you choose?",
    options: [
      "Proportions of a whole",
      "Comparison between categories",
      "Trends over time",
      "Correlation between two variables"
    ],
    answer: "C"
  },
  {
    id: "data-analytics-13",
    question:
      "You want to check whether study hours are associated with test scores. Which chart is mainly used to view this relationship?",
    options: [
      "Distribution of a single variable",
      "Relationship between two continuous variables",
      "Comparison of categories",
      "Cumulative totals over time"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-14",
    question:
      "A business team requests an interactive dashboarding tool for data visualization and reporting. Which option is a BI tool?",
    options: ["NumPy", "Tableau", "Scikit-learn", "TensorFlow"],
    answer: "B"
  },
  {
    id: "data-analytics-15",
    question:
      "Leadership asks for one screen where core metrics (applications, pass rate, completion rate) are monitored together. In visualization, this screen is called:",
    options: [
      "To store raw data in a secure location",
      "To provide a consolidated visual summary of key metrics",
      "To automate the data cleaning process",
      "To run complex machine learning models"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-16",
    question:
      "You load intern data with Pandas and want to quickly preview the first five rows before cleaning. Which method should you use?",
    options: ["df.tail()", "df.show()", "df.head()", "df.describe()"],
    answer: "C"
  },
  {
    id: "data-analytics-17",
    question:
      "Data quality checks require seeing how many missing values each column has. What does `df.isnull().sum()` return?",
    options: [
      "The total number of rows in the DataFrame",
      "The count of missing values in each column",
      "The sum of all numerical values",
      "Rows where all values are null"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-18",
    question:
      "You are choosing a Python package mainly for tabular data manipulation and analysis. Which one is the best fit?",
    options: ["Matplotlib", "Seaborn", "Pandas", "SciPy"],
    answer: "C"
  },
  {
    id: "data-analytics-19",
    question:
      "A business unit's sales rise from $200,000 to $250,000. What is the percentage increase?",
    options: ["20%", "25%", "50%", "5%"],
    answer: "B"
  },
  {
    id: "data-analytics-20",
    question:
      "During monthly reviews, management tracks values such as conversion rate and cost per hire to evaluate whether goals are being met. These values are examples of:",
    options: [
      "A type of database query",
      "A measurable value that shows how effectively an objective is being met",
      "A Python function used for statistical analysis",
      "A method for cleaning missing data"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-21",
    question:
      "An analyst strongly believes one campaign is best and only highlights numbers supporting that belief, while ignoring conflicting evidence. This behavior is:",
    options: [
      "Using too large a dataset to draw conclusions",
      "The tendency to favor data that supports a pre-existing belief while ignoring contradicting evidence",
      "Errors introduced during the data collection phase",
      "Over-fitting a model to training data"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-22",
    question:
      "A customer satisfaction survey is sent only to customers who bought in the last 7 days, excluding everyone else. Which bias is most relevant?",
    options: ["Confirmation bias", "Survivorship bias", "Sampling bias", "Anchoring bias"],
    answer: "C"
  },
  {
    id: "data-analytics-23",
    question:
      "A startup studies only successful product launches and ignores failed launches when drawing lessons. This is an example of:",
    options: [
      "Focusing only on data from the most profitable customers",
      "Analyzing only the entities that passed a selection filter while ignoring those that did not",
      "Giving too much weight to the first data point observed",
      "Overgeneralizing results from a small sample"
    ],
    answer: "B"
  },
  {
    id: "data-analytics-24",
    question:
      "An intern finds that ice cream sales and drowning incidents both rise in summer, then claims ice cream causes drowning. This mistake is:",
    options: ["Sampling bias", "Overfitting", "Confusing correlation with causation", "Anchoring bias"],
    answer: "C"
  },
  {
    id: "data-analytics-25",
    question:
      "A reporting architect asks whether data should be stored at daily summary level or transaction-level detail. This choice is about:",
    options: [
      "The visual quality of charts and graphs in a report",
      "The level of detail or precision at which data is stored and analyzed",
      "The number of duplicate records in a dataset",
      "A technique used to encrypt sensitive data"
    ],
    answer: "B"
  }
];
