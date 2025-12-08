# Customer-Shopping-Behavior-Analysis

A complete end-to-end analytics project exploring how customers shop across different product categories. This project combines **Python, SQL (MySQL), and Power BI** to uncover patterns in spending, product demand, customer loyalty, and subscription behavior. The goal is to transform raw transactional data into clear insights that support better business decisions. 

---

## 🔍 **Project Overview**

This project analyzes **3,900 customer transactions** across 18 features, including demographics, purchase details, discounts, ratings, and shopping behavior.
The analysis focuses on:

* Understanding **what customers buy**
* Identifying **which segments spend the most**
* Measuring **the impact of discounts and subscriptions**
* Finding **top-rated and top-selling products**
* Building recommendations that help businesses improve retention and revenue 

---

## 📊 **Tech Stack**

* **Python** (Pandas, NumPy, Matplotlib/Seaborn)
* **SQL – MySQL**
* **PostgreSQL integration**
* **Power BI Dashboard**
* **Jupyter Notebook**

---

## 🧹 **Data Preprocessing**

Key steps completed in Python:

* Loaded and explored dataset with `df.info()` and `df.describe()`
* Imputed missing values in review ratings using category medians
* Standardized column names for readability
* Engineered new features like **age groups** and **purchase frequency**
* Dropped redundant variables after correlation checks
* Loaded cleaned data into PostgreSQL for SQL analysis 

---

## 🧠 **Analysis Performed**

### **Using SQL**

Insights extracted from structured queries:

* Revenue comparison by gender
* High-spending customers using discounts
* Top 5 products based on ratings
* Average purchase amount by shipping type
* Subscriber vs. non-subscriber spending
* Most discount-dependent products
* Customer classification: **New, Returning, Loyal**
* Top 3 products per category
* Subscription likelihood among repeat buyers
* Revenue contribution by age groups 

---

## 📈 **Power BI Dashboard**

Built an interactive dashboard visualizing:

* Average purchase amount
* Average review rating
* Sales by category
* Revenue by age group
* Subscription status distribution
* Product category drill-downs
* Filters for gender, category, shipping, and subscription status 

---

## 🎯 **Key Insights**

* Clothing leads in revenue contribution
* Loyal customers dominate total purchases
* Young adults generate the highest revenue
* Express shipping users spend slightly more
* Subscriptions positively correlate with repeat buying behavior
* Top products (e.g., Gloves, Sandals, Boots) consistently show high ratings and demand 

---

## 💡 **Business Recommendations**

* Strengthen loyalty programs for high-value customers
* Promote subscription benefits to increase recurring revenue
* Highlight best-rated / most-purchased items in marketing campaigns
* Optimize discount strategy for categories highly dependent on offers
* Focus campaigns on **high-revenue age groups**
* Improve shipping experiences as it influences spending behavior 

---

## 📂 **Project Structure**

```
├── data/
├── notebooks/
├── sql_queries/
├── powerbi_dashboard/
├── scripts/
└── README.md
```

---

## 🚀 **About the Project**

This project reflects my hands-on experience in solving real analytics problems using both technical and business lenses. I aimed to build a workflow that feels close to what analysts do in real industry environments—cleaning data, exploring patterns, validating through SQL, and presenting insights clearly through dashboards.

---

# 👤 **About Section (Human, Professional, Recruiter-Friendly)**

This project showcases my ability to take raw customer transaction data and turn it into meaningful insights that support decision-making. I combined Python, SQL, and Power BI to understand how different types of customers shop, what drives their spending, and which products contribute most to revenue.

I focused on building a clean, end-to-end pipeline—covering data cleaning, feature engineering, SQL-based business analysis, and a dashboard that presents insights in a simple and actionable way.
The goal was not just technical execution but also telling a clear story that can help a business improve retention, optimize marketing, and increase revenue.

This project reflects my approach as an analyst: **curious about patterns, careful with data, and committed to delivering insights that truly matter**.

---

