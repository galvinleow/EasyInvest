# Homerce - Developer Guide

## Table of Contents:
 * [1. **Introduction**](#1-introduction)
 * [2. **Setting up**](#2-setting-up)
 * [3. **Design**](#3-design)
     * [3.1 Architecture](#3.1-architecture)
     * [3.2 UI Component](#3.2-ui-component)
     * [3.3 Logic Component](#3.3-logic-component)
     * [3.4 Model Component](#3.4-model-component)
     * [3.5 Storage Component](#3.5-storage-component)
     * [3.6 Common Classes](#3.6-common-classes)
 * [4. **Implementation**](#4-implementation)
     * [4.1 List Managers](#4.1-list-managers)
 * [5. **Documentation**](#5-documentation)
 * [6. **Logging**](#6-logging)
 * [7. **Testing**](#7-testing)
 * [8. **Configuration**](#8-configuration)
 * [9. **DevOps**](#9-dev-ops)
 * [**Appendix A: Product Scope**](#appendix-a-product-scope)
 * [**Appendix B: User Stories**](#appendix-b-user-stories)
 * [**Appendix C: Use Cases**](#appendix-c-use-cases)
 * [**Appendix D: Non Functional Requirements**](#appendix-d-non-functional-requirements)
 * [**Appendix E: Glossary**](#appendix-e-glossary)
 * [**Appendix F: Instructions for Manual Testing**](#appendix-f-instructions-for-manual-testing)
 * [**Appendix G: Effort**](#appendix-g-effort)

## 1. **Introduction**

**Homerce** is a desktop business management application meant for home-based beauty salon owners who want to consolidate all
the information related to their business, such as upcoming appointments, their list of clients, as well as profits recorded.
It focuses on the Command Line Interface (CLI) while providing users with a simple and clean Graphical User Interface (GUI).
Thus, the main interaction with **Homerce**. will be done through commands.

The features of Homerce include:
* Keeping track of existing/new clients.
* Scheduling of upcoming appointments with clients.
* Recording of revenue from services provided.
* Recording of business-related expenses.
* Calculation of business profit.

The purpose of this Developer Guide is to help you understand the design and implementation of **Homerce**,
so that you can get started on your contributions to **Homerce**.

## 2. **Setting up**

Refer to the guide [_Setting up and getting started_](SettingUp.md).

## 3. **Design**

This section will help you learn more about the design and structure of Homerce.

### 3.1 Architecture

The ***Architecture Diagram*** given below explains the high-level design of the Homerce. 

<img src="images/ArchitectureDiagram.png" width="450" />

<div markdown="span" class="alert alert-primary">

:bulb: **Tip:** The `.puml` files used to create diagrams in this document can be found in the [diagrams](https://github.com/se-edu/addressbook-level3/tree/master/docs/diagrams/) folder. Refer to the [_PlantUML Tutorial_ at se-edu/guides](https://se-education.org/guides/tutorials/plantUml.html) to learn how to create and edit diagrams.

</div>

The table below gives an overview of each component in Homerce. More details about each component can be found in the following subsections.

| Component | Overview |
|-----------|----------|
|**`Main`**| Has two classes called [`Main`](https://github.com/se-edu/addressbook-level3/tree/master/src/main/java/seedu/address/Main.java) and [`MainApp`](https://github.com/se-edu/addressbook-level3/tree/master/src/main/java/seedu/address/MainApp.java). <br> It is responsible for: <br> 1. At app launch: Initializes the components in the correct sequence, and connects them up with each other. <br> 2. At shut down: Shuts down the components and invokes cleanup methods where necessary.|
|**`Commons`**|Represents a collection of classes used by multiple other components.|
|**`UI`**|The UI of the App.|
|**`Logic`**|The command executor.|
|**`Model`**|Holds the data of the App in memory.|
|**`Storage`**|Reads data from, and writes data to, the hard disk.|

Each of the four components - `UI`, `Logic`, `Model`, and `Storage`,
* defines its *API* in an `interface` with the same name as the Component.
* exposes its functionality using a concrete `{Component Name}Manager` class (which implements the corresponding API `interface` mentioned in the previous point. For example, the `Logic` component defines its API in the `Logic.java` interface and exposes its functionality using the `LogicManager.java` class which implements the `Logic` interface.

**How the architecture components interact with each other**

The *Sequence Diagram* below shows how the components interact with each other for the scenario where the user issues the command `deletecli 1`.

<img src="images/ArchitectureSequenceDiagram.png" width="574" />

The sections below give more details of each component.

### 3.2 UI Component

![Structure of the UI Component](images/UiClassDiagram.png)

**API** :
[`Ui.java`](https://github.com/se-edu/addressbook-level3/tree/master/src/main/java/seedu/address/ui/Ui.java)

The UI consists of a `MainWindow` that is made up of parts e.g.`CommandBox`, `ResultDisplay`, `ClientListPanel`, `StatusBarFooter` etc. All these, including the `MainWindow`, inherit from the abstract `UiPart` class.

The `UI` component uses JavaFx UI framework. The layout of these UI parts are defined in matching `.fxml` files that are in the `src/main/resources/view` folder. For example, the layout of the [`MainWindow`](https://github.com/se-edu/addressbook-level3/tree/master/src/main/java/seedu/address/ui/MainWindow.java) is specified in [`MainWindow.fxml`](https://github.com/se-edu/addressbook-level3/tree/master/src/main/resources/view/MainWindow.fxml)

The `UI` component,

* Executes user commands using the `Logic` component.
* Listens for changes to `Model` data so that the UI can be updated with the modified data.

### 3.3 Logic Component

![Structure of the Logic Component](images/LogicClassDiagram.png)

**API** :
[`Logic.java`](https://github.com/se-edu/addressbook-level3/tree/master/src/main/java/seedu/address/logic/Logic.java)

1. `Logic` uses the `AddressBookParser` class to parse the user command.
1. This results in a `Command` object which is executed by the `LogicManager`.
1. The command execution can affect the `Model` (e.g. adding a client).
1. The result of the command execution is encapsulated as a `CommandResult` object which is passed back to the `Ui`.
1. In addition, the `CommandResult` object can also instruct the `Ui` to perform certain actions, such as displaying help to the user.

Given below is the Sequence Diagram for interactions within the `Logic` component for the `execute("delete 1")` API call.

![Interactions Inside the Logic Component for the `delete 1` Command](images/DeleteSequenceDiagram.png)

<div markdown="span" class="alert alert-info">:information_source: **Note:** The lifeline for `DeleteCommandParser` should end at the destroy marker (X) but due to a limitation of PlantUML, the lifeline reaches the end of diagram.
</div>

### 3.4 Model Component

![Structure of the Model Component](images/ModelClassDiagram.png)

**API** : [`Model.java`](https://github.com/se-edu/addressbook-level3/tree/master/src/main/java/seedu/address/model/Model.java)

The `Model`,

* stores a `UserPref` object that represents the user’s preferences.
* stores the address book data.
* exposes an unmodifiable `ObservableList<Client>` that can be 'observed' e.g. the UI can be bound to this list so that the UI automatically updates when the data in the list change.
* does not depend on any of the other three components.


<div markdown="span" class="alert alert-info">:information_source: **Note:** An alternative (arguably, a more OOP) model is given below. It has a `Tag` list in the `AddressBook`, which `Client` references. This allows `AddressBook` to only require one `Tag` object per unique `Tag`, instead of each `Client` needing their own `Tag` object.<br>
![BetterModelClassDiagram](images/BetterModelClassDiagram.png)

</div>


### 3.5 Storage Component

![Structure of the Storage Component](images/StorageClassDiagram.png)

**API** : [`Storage.java`](https://github.com/se-edu/addressbook-level3/tree/master/src/main/java/seedu/address/storage/Storage.java)

The `Storage` component,
* can save `UserPref` objects in json format and read it back.
* can save the address book data in json format and read it back.

### 3.6 Common Classes

Classes used by multiple components are in the `seedu.addressbook.commons` package.

--------------------------------------------------------------------------------------------------------------------

## 4. **Implementation**
This section describes some noteworthy details on how certain features are implemented.

### 4.1 List Managers
Homerce allows the user to manage different essential lists for his or her home-based beauty salon.

The different types of lists include:
1. Appointments list
2. Clients list
3. Services list

All these lists are managed by a `ListManager` which support basic [CRUD](#appendix-e-glossary) operations and some
additional operations depending on the different types of `ListManager`s. Additional operations include operations such as
`sort`. The term *item* will be used to refer to an element stored in a list.

Common commands for all list managers:
* `add` - Creates a new list item
* `edit` - Modifies an existing list item
* `delete` - Removes an existing item from the list
* `list` - Shows all items in the list
* `find` - Searches for item(s) in the list
* `clear` - Removes all the items in the list

#### 4.1.1 Rationale 
When running a home-based beauty salon, there are many things that the user needs to manage. The 3 lists stated above
are essential to every home-based beauty salon. That is why there are `ListManager`s to help the user manage the 3
lists so that they can run their home-based beauty salon effectively and efficiently. 

#### 4.1.2 Current Implementation
In this section, we will explain the structure of a `ListManager`.
As mentioned in this section's overview, the term *item* refers to an element stored in a list.

The `ListManager` contains a `UniqueList` which is a data structure that stores all the *items* of a list. The 
`UniqueList` uses Java's generics and contains items that implement the `UniqueListItem` interface. The uniqueness of
an *item* in the list is checked using the `isSame()` method of the `UniqueListItem` interface.

The `ListManager` also implements the `ReadOnlyManager` interface which has the `getList()` method. The `getList()` method
returns an `ObservableList` of *items*. For instance, `ServiceManager` implements `ReadOnlyServiceManager`. The
`ObservableList` of *items* allow listeners to track changes when they occur and reflect these changes to the graphical
user interface.

The following class diagram models the structure of the `ListManager`.

![Class diagram for list manager](images/ListManagerClassDiagram.png) 
*Figure 1. Structure of `ListManager`*

#### 4.1.3 Design Consideration 
**Aspect: Implementation of a `ListManager`**
|              | **Pros**   | **Cons** |
| -------------|-------------| -----|
| **Option 1 (current choice)** <br> Extract the common functionality of the <br> 3 `ListManager`s into one generic `UniqueList` class.<br> The `UniqueList` class is used as the base data structure <br> and all 3 `ListManager`s build additional functionality on top of it. | Makes use of the Don't Repeat Yourself (DRY) principle which guards against duplication of information and minimizes repeated code.| All `ListManager`s will have dependencies on `UniqueList`. Implementation of all `ListManager`s will require `UniqueList` to be finished implementing first.|
| **Option 2** <br> Do not extract any common functionalities.| Each member can begin working on their own implementation of `ListManager` immediately and independently as there are no dependencies on a common `UniqueList`. | Violates DRY principle and results in a lot of repeated code and functionality|

Reason for choosing option 1:
* Follow good coding standards by applying design principles such as the DRY principle.
* Reduce total man-hours required to create each `ListManager` once the common dependency of `UniqueList` has been created.

### 4.2 List Trackers 
Homerce allows the user to keep track of different lists that stores the financial details of his or her home-based beauty salon.

The different types of lists include:
1. Expenses list
2. Revenue list

All these lists tracked by a `ListTracker`. The `ListTracker` for an expenses list will have additional `add`, `edit`,
and `delete` operations. The term *item* will be used to refer to elements stored in a list.

Common commands for all list managers:
* `sort` - Sorts the list by the given order
* `list` - Shows all items in the list
* `find` - Searches for item(s) in the list
* `clear` - Removes all the items in the list
* `breakdown` - Categorizes and gives an overview of the items in the list

#### 4.2.1 Rationale 
When running a home-based beauty salon, it is important to keep track of the financials of the business. The revenue and
expenses information are essential to any home-based beauty salon. That is why there are `ListTrackers`s to help the user manage 
the revenue and expenses lists so that they can keep track of their home-based beauty salon's profitability conveniently. 

#### 4.2.2 Current Implementation
In this section, we will explain the structure of a `ListTracker`.
As mentioned in this section's overview, the term *item* refers to an element stored in a list.

The `ListTracker` contains a `NonUniqueList` which is a data structure that stores all the *items* of a list. The 
`NonUniqueList` uses Java's generics and contains items that implement the `NonUniqueListItem` interface. 

The `ListTracker` also implements the `ReadOnlyTracker` interface which has the `getList()` method. The `getList()` method
returns an `ObservableList` of *items*. For instance, `RevenueTracker` implements `ReadOnlyRevenueTracker`. The
`ObservableList` of *items* allow listeners to track changes when they occur and reflect these changes to the graphical
user interface.

The following class diagram models the structure of the `ListTracker`.
![Class diagram for list tracker](images/ListTrackerClassDiagram.png)
*Figure 2. Structure of `ListTracker`*

#### 4.2.3 Design Consideration 
**Aspect: Separating a `ListManager` from a `ListTracker`**
|              | **Pros**   | **Cons** |
| -------------|-------------| -----|
| **Option 1** <br> Make use of a `ListManager` to keep track of expenses and revenue as well | Reduces repeated code for certain functionalities such as `list`, `find` and `clear`. | A `ListManager` depends on a `UniqueList` which ensure that all *items* in the list are unique. However, revenue and expense entries may not be unique. This means that revenue and expense *item* entries can not be properly represented using a `ListManager`.|
| **Option 2 (current choice)** <br> Create a new `ListTracker` to keep track of expenses and revenue | Allows for a proper representation of non unique revenue and expense items in Homerce. | Some code will be repeated for certain common functionalities amongst `ListManager` and `ListTracker`.|

Reason for choosing option 2:
* Homerce needs to be able to add revenue and expense details for it to track the financials of the home-based beauty salon. This can only be done with a `ListTracker` which allows for non-unique list *items*.
* Using `ListTracker` with a dependency on `NonUniqueList` allows for a different implementation when comparing two *items* in the list.

**Aspect: Implementation of a `ListTracker`**
|              | **Pros**   | **Cons** |
| -------------|-------------| -----|
| **Option 1 (current choice)** <br> Extract the common functionality of the <br> 3 `ListTracker`s into one generic `NonUniqueList` class.<br> The `NonUniqueList` class is used as the base data structure <br> and both `ListTracker`s build additional functionality on top of it. | Makes use of the Don't Repeat Yourself (DRY) principle which guards against duplication of information and minimizes repeated code.| Both `ListTracker`s will have dependencies on `NonUniqueList`. Implementation of both `ListTracker`s will require `NonUniqueList` to be finished implementing first.|
| **Option 2** <br> Do not extract any common functionalities.| Each member can begin working on their own implementation of `ListTracker` immediately and independently as there are no dependencies on a common `NonUniqueList`. | Violates DRY principle and results in a lot of repeated code and functionality|

Reason for choosing option 1:
* Follow good coding standards by applying design principles such as the DRY principle.
* Reduce total man-hours required to create each `ListTracker` once the common dependency of `NonUniqueList` has been created.



## 5. **Documentation**

Refer to the guide [here](Documentation.md).

## 6. **Logging**
Refer to the guide [here](Logging.md).

## 7. **Testing**
Refer to the guide [here](Testing.md).

## 8. **Configuration**
Refer to the guide [here](Configuration.md).

## 9. **Dev-ops**
Refer to the guide [here](DevOps.md).

## **Appendix A: Product Scope**

**Target user profile**:
* Independent home-based business owner.
* Has little knowledge of business management software.
* Prefers to have relevant business components in a single application.
* Is a fast typist.
* Prefers typing over using mouse input.

**Value proposition**:
* Consolidates everything a home-based business needs such as appointments, clients, expenses, revenue and services into one place
* Saves significant time for the business owner, who previously had to manage details across his/her contacts, excel sheets, and inventory notebooks.
* Does not require extensive technical knowledge compared to other business management software.
* Displays expenses and revenue in a simple format for users to view.

## **Appendix B: User Stories**

Priorities: High (must have) - `* * *`, Medium (nice to have) - `* *`, Low (unlikely to have) - `*`

| Priority | As a …​                                          | I want to …​                                                                                                             | So that I can…​                                                                                                      |
| -------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `* * *`  | Meticulous home-based beauty salon owner        | Keep track of my total monthly revenue                                                                                  | Have a good idea of how my business is doing                                                                        |
| `* * *`  | Budget-minded home-based beauty salon owner     | Keep track of my total monthly business-related expenses                                                                | Adjust the pricing of my services accordingly                                                                       |
| `* * *`  | Business-minded home-based beauty salon owner   | Keep track of my total monthly profit                                                                                   | Understand if my business is profitable and if it falls within a healthy profit margin                              |
| `* * *`  | Forgetful home-based beauty salon owner         | Find a service based on its name/keyword                                                                                | Easily refer to the price/duration of the service to answer client queries                                          |
| `* * *`  | Home-based beauty salon owner                   | Edit a service                                                                                                          | Change details about a specific service accordingly, such as adjusting the price/duration                           |
| `* * *`  | Home-based beauty salon owner                   | Delete a service                                                                                                        | Remove a service that I am no longer offering                                                                       |
| `* * *`  | Home-based beauty salon owner                   | Add a service                                                                                                           | Enter a new service that I recently decided to offer                                                                |
| `* * *`  | Home-based beauty salon owner                   | List my services                                                                                                        | View all the services that I am currently offering                                                                  |
| `* * *`  | Organized home-based beauty salon owner         | Keep track of all my clients                                                                                            | To find my clients easily when I want to contact them                                                               |
| `* * *`  | Home-based beauty salon owner                   | Add a client                                                                                                            | Record a new client that has not visited my salon before                                                            |
| `* * *`  | Home-based beauty salon owner                   | Edit a client                                                                                                           | Change details about a specific client, such as their new contact information                                       |
| `* * *`  | Home-based beauty salon owner                   | Find a client by their name or phone number                                                                             | Determine if the client has visited my salon before, and find their contact details from their name or vice versa   |
| `* * *`  | Organized home-based beauty salon owner         | Keep track of all my appointments, including the date and time of the appointment, service provided, and client served, | Organize my work schedule and avoid double-booking of appointments                                                  |
| `* * *`  | Home-based beauty salon owner                   | Add an appointment                                                                                                      | Enter a new appointment made into my appointment schedule                                                           |
| `* * *`  | Home-based beauty salon owner                   | Edit an appointment                                                                                                     | Change appointment details, such as date/time if the appointment is postponed                                       |
| `* * *`  | Home-based beauty salon owner                   | Delete an appointment                                                                                                   | Remove an appointment from my schedule if the client cancels or does not turn up                                    |
| `* * *`  | Forgetful home-based beauty salon owner         | Find an appointment                                                                                                     | Easily refer to the appointment details to answer client queries                                                    |
| `* * *`  | Home-based beauty salon owner                   | Mark an appointment as done                                                                                             | Add a record for revenue earned from that appointment                                                               |
| `* * *`  | Home-based beauty salon owner                   | List my revenues                                                                                                        | View all the revenue entries that I have                                                                            |
| `* * *`  | Forgetful home-based beauty salon owner         | Find a revenue                                                                                                          | See exactly how much revenue a certain type of service is bringing in                                               |
| `* *`    | Home-based beauty salon owner                   | Add an expense                                                                                                          | Record a new expense that I have made                                                                               |
| `* *`    | Home-based beauty salon owner                   | Tag my expense                                                                                                          | Organise my expenses according to the categories they fall under, such as an expense related to a particular service|
| `* *`    | Home-based beauty salon owner                   | Edit an expense                                                                                                         | Change the details of an expense, in the case that I input the wrong price/description of the expense               |
| `* *`    | Home-based beauty salon owner                   | Delete an expense                                                                                                       | Remove an expense that I may have added mistakenly                                                                  |
| `* *`    | Home-based beauty salon owner                   | Sort my expenses based on their price                                                                                   | Have an idea of which expenses incur the most/least cost to my business                                             |
| `* *`    | Home-based beauty salon owner                   | List my expenses                                                                                                        | View all the expense entries that I have                                                                            |
| `*    `  | Busy home-based beauty salon owner              | Have a built-in help guide                                                                                              | Familiarize myself with the application quickly                                                                     |
| `*    `  | Home-based beauty salon owner                   | Clear all the information in the application                                                                            | Restart all my beauty salon related records from scratch                                                            |
| `*    `  | Prudent home-based beauty salon owner           | Have a breakdown of my total monthly expenses based on the type of expense                                              | Minimize my expenditure on certain types of expenses                                                                |
| `*    `  | Resourceful home-based beauty salon owner       | Have a breakdown of my total monthly revenue based on the type of service provided                                      | Have an idea of which services generate more revenue and adjust the services I provide accordingly                  |


## **Appendix C: Use Cases**

(For all use cases below, the **System** is `Homerce` and the **Actor** is the `user`, unless specified otherwise)

### Services Management

#### UC001: Add a Service
Add a service provided by the business into Homerce.

**System: Homerce**

**Actor: User**

**Preconditions: Appointment list must exist.**

**Guarantees: A new service will be added to the service list upon successful command.**

**MSS**
1. User adds a service by providing details.
1. Homerce adds the service to the service list.
1. Homerce displays the updated list and a successful message.
Use case ends.

**Extensions**
* 1a. Incomplete details provided.
  * 1a1. Homerce displays an error message.
  Use case resumes at step 1.

#### UC002: Edit a Service
Edit the details of an existing service.

**System: Homerce**

**Actor: User**

**Preconditions: Service exists in service list.**

**Guarantees: Updated service list with new service details.**

**MSS**
1. User requests to list all services.
1. Homerce shows a list of services.
1. User edits an existing service by providing the details.
1. Homerce updates the details of the selected service.
1. Homerce updates the service list.
1. Homerce displays the updated list and a successful message.
Use case ends.

**Extensions**
* 3a. Invalid index provided.
  * 3a1. Homerce displays an error message.
  Use case resumes at step 1.

* 3b. Invalid details provided.
  * 3b1. Homerce displays an error message.
  Use case resumes at step 1.

#### UC003: Delete a Service
Delete the selected service from the service list.

**System: Homerce**

**Actor: User**

**Preconditions: Service exists in service list.**

**Guarantees: Updated service list with service specified by user deleted.**

**MSS**
1. User requests to list all services.
1. Homerce shows a list of services.
1. User requests to delete a specific service.
1. Homerce deletes a service.
1. Homerce displays the updated list.
1. Homerce displays a successful message.
Use case ends.

**Extensions**
* 3a. Invalid index provided.
  * 3a1. Homerce displays an error message.
  Use case resumes at step 1.

#### UC004: Find a Service
Find a service in the service list.

**System: Homerce**

**Actor: User**

**Preconditions: Service exists in service list.**

**Guarantees: Display all services in the service list that matches the search value.**

**MSS**
1. User requests to list all services that match the search value.
1. Homerce searches for services that match search value.
1. Homerce shows a list of all services that match the search value.
1. Homerce displays a message stating the amount of services listed.
Use case ends.

**Extensions**
* 2a. No service matches the search value.
  * 2a1. Homerce displays an empty list.
  Use case resumes at step 4.

#### UC005: List Services
List all the services in the service list.

**System: Homerce**

**Actor: User**

**Preconditions: Service exists in service list.**

**Guarantees: All services in the service list will be displayed.**

**MSS**
1. User requests to list all services.
1. Homerce displays all services in the service list.
1. Homerce displays a successful listed message.
Use case ends.

**Extensions**
* 1a. No service in service list.
  * 1a1. Homerce displays an empty list.
  Use case resumes at step 3.

#### UC006: Clear Services
Clear all services in the service list.

**System: Homerce**

**Actor: User**

**Preconditions: Service list must exist.**

**Guarantees: An empty service list.**

**MSS**
1. User requests to clear the list.
1. Homerce displays an empty list and a successful message.
Use case ends.

### Client Management

#### UC007: Add a Client
Add a client into Homerce.

**System: Homerce**

**Actor: User**

**Preconditions: Client list must exist.**

**Guarantees: A new client will be added to the client list upon successful command.**

**MSS**
1. User adds a client by providing details.
1. Homerce adds the client to the client list.
1. Homerce displays the updated list and a successful message.
Use case ends.

**Extensions**
* 1a. Incomplete details provided.
  * 1a1. Homerce displays an error message.
  Use case resumes at step 1.

#### UC008: Edit a Client's Details
Edit the details of an existing client.

**System: Homerce**

**Actor: User**

**Preconditions: Client exists in client list.**

**Guarantees: Updated client list with new client details.**

**MSS**
1. User requests to list all clients.
1. Homerce shows a list of clients.
1. User edits an existing client's details by providing the updated details.
1. Homerce updates the details of the selected client.
1. Homerce updates the client list.
1. Homerce displays the updated list and a successful message.
Use case ends.

**Extensions**
* 3a. Invalid index provided.
  * 3a1. Homerce displays an error message.
  Use case resumes at step 1.

* 3b. Invalid details provided.
  * 3b1. Homerce displays an error message.
  Use case resumes at step 1.

#### UC009: Delete a Client
Delete the selected client from the client list.

**System: Homerce**

**Actor: User**

**Preconditions: Client exists in client list.**

**Guarantees: Updated client list with client specified by user deleted.**

**MSS**
1. User requests to list all clients.
1. Homerce shows a list of clients.
1. User requests to delete a specific clients.
1. Homerce deletes a client.
1. Homerce displays the updated list.
1. Homerce displays a successful message.
Use case ends.

**Extensions**
* 3a. Invalid index provided.
  * 3a1. Homerce displays an error message.
  Use case resumes at step 1.

#### UC010: Find a Client
Find a client in the client list.

**System: Homerce**

**Actor: User**

**Preconditions: Client exists in client list.**

**Guarantees: Display all clients in the client list that matches the search value.**

**MSS**
1. User requests to list all clients that match the search value.
1. Homerce searches for clients that match search value.
1. Homerce shows a list of all clients that match the search value.
1. Homerce displays a message stating the amount of clients listed.
Use case ends.

**Extensions**
* 2a. No client matches the search value.
  * 2a1. Homerce displays an empty list.
  Use case resumes at step 4.

#### UC011: List Clients
List all the clients in the client list.

**System: Homerce**

**Actor: User**

**Preconditions: Clients exists in client list.**

**Guarantees: All clients in the client list will be displayed.**

**MSS**
1. User requests to list all clients.
1. Homerce displays all clients in the client list.
1. Homerce displays a successful listed message.
Use case ends.

**Extensions**
* 1a. No client in client list.
  * 1a1. Homerce displays an empty list.
  Use case resumes at step 3.

#### UC012: Clear Clients
Clear all clients in the client list.

**System: Homerce**

**Actor: User**

**Preconditions: Client list must exist.**

**Guarantees: An empty client list.**

**MSS**
1. User requests to clear the list.
1. Homerce displays an empty list and a successful message.
Use case ends.

### Appointment Management

#### UC013: Add an Appointment
Schedule an appointment into Homerce.

**System: Homerce**

**Actor: User**

**Preconditions: Appointment list must exist.**

**Guarantees: A new appointment will be added to the appointment list upon successful command.**

**MSS**
1. User adds an appointment by providing details.
1. Homerce adds the appointment to the appointment list.
1. Homerce displays the updated list and a successful message.
Use case ends.

**Extensions**
* 1a. Incomplete details provided.
  * 1a1. Homerce displays an error message.
  Use case resumes at step 1.

#### UC014: Edit an Appointment Details
Edit the details of an existing appointment.

**System: Homerce**

**Actor: User**

**Preconditions: Appointment exists in appointment list.**

**Guarantees: Updated appointment list with new appointment details.**

**MSS**
1. User requests to list all appointments.
1. Homerce shows a list of appointments.
1. User edits an existing appointment details by providing the updated details.
1. Homerce updates the details of the selected appointment.
1. Homerce updates the appointment list.
1. Homerce displays the updated list and a successful message.
Use case ends.

**Extensions**
* 3a. Invalid index provided.
  * 3a1. Homerce displays an error message.
  Use case resumes at step 1.

* 3b. Invalid details provided.
  * 3b1. Homerce displays an error message.
  Use case resumes at step 1.

#### UC015: Delete an Appointment
Delete the selected appointment from the appointment list.

**System: Homerce**

**Actor: User**

**Preconditions: Appointment exists in appointment list.**

**Guarantees: Updated appointment list with appointment specified by user deleted.**

**MSS**
1. User requests to list all appointments.
1. Homerce shows a list of appointments.
1. User requests to delete a specific appointments.
1. Homerce deletes an appointment.
1. Homerce displays the updated list.
1. Homerce displays a successful message.
Use case ends.

**Extensions**
* 3a. Invalid index provided.
  * 3a1. Homerce displays an error message.
  Use case resumes at step 1.

#### UC016: Find an Appointment
Find an appointment in the appointment list.

**System: Homerce**

**Actor: User**

**Preconditions: Appointment exists in appointment list.**

**Guarantees: Display all appointments in the appointment list that matches the search value.**

**MSS**
1. User requests to list all appointments that match the search value.
1. Homerce searches for appointments that match search value.
1. Homerce shows a list of all appointments that match the search value.
1. Homerce displays a message stating the amount of appointments listed.
Use case ends.

**Extensions**
* 2a. No appointment matches the search value.
  * 2a1. Homerce displays an empty list.
  Use case resumes at step 4.

#### UC017: List Appointments
List all the appointments in the appointment list.

**System: Homerce**

**Actor: User**

**Preconditions: Appointments exists in appointment list.**

**Guarantees: All appointments in the appointment list will be displayed.**

**MSS**
1. User requests to list all appointments.
1. Homerce displays all appointments in the appointment list.
1. Homerce displays a successful listed message.
Use case ends.

**Extensions**
* 1a. No appointment in appointment list.
  * 1a1. Homerce displays an empty list.
  Use case resumes at step 3.

#### UC018: Clear Appointments
Clear all appointments in the appointment list.

**System: Homerce**

**Actor: User**

**Preconditions: Appointment list must exist.**

**Guarantees: An empty appointment list.**

**MSS**
1. User requests to clear the list.
1. Homerce displays an empty list and a successful message.
Use case ends.

#### UC019: Appointment Done
Indicate that the appointment have been done.

**System: Homerce**

**Actor: User**

**Preconditions: Appointment exists in appointment list.**

**Guarantees: Appointment indicated as done.**

**MSS**
1. User requests to list all appointments.
1. Homerce shows a list of appointments.
1. User requests to mark a specific appointment as done.
1. Homerce indicate that the appointment have be completed.
1. Homerce <ins>adds a revenue (UC027)</ins>.
1. Homerce displays all appointments in the appointment list.
1. Homerce displays a successful listed message.

**Extensions**
* 3a. Invalid index provided.
  * 3a1. Homerce displays an error message.
  Use case resumes at step 1.
  
#### UC020: Appointment Undone
Indicate that the appointment has not been completed.
 
**System: Homerce**
  
**Actor: User**
  
**Preconditions: Appointment exists in appointment list, and it is indicated as done.**
  
**Guarantees: Appointment indicated as undone.**
 
**MSS**
1. User requests to list all appointments.
1. Homerce shows a list of appointments.
1. User requests to mark a specific appointment as undone.
1. Homerce indicate that the appointment have be completed.
1. Homerce <ins>deletes a revenue (UC028)</ins>.
1. Homerce displays all appointments in the appointment list.
1. Homerce displays a successful listed message.
  
**Extensions**
* 3a. Invalid index provided.
  * 3a1. Homerce displays an error message.
  Use case resumes at step 1.

### Expense Tracker

```
#### UC021: Add an Expense
Add an expense incurred by the business into Homerce.

**System: Homerce**

**Actor: User**

**Preconditions: Expense list must exist.**

**Guarantees: A new expense will be added to the expense list upon successful command.**

**MSS**
1. User adds an expense by providing details.
1. Homerce adds the expense to the expense list.
1. Homerce displays the updated list and a successful message.
Use case ends.

**Extensions**
* 1a. Incomplete details provided.
  * 1a1. Homerce displays an error message.
  Use case resumes at step 1.
```

```
#### UC022: Edit an Expense
Edit the details of an existing expense.

**System: Homerce**

**Actor: User**

**Preconditions: Expense exists in expense list.**

**Guarantees: Updated expense list with new expense details.**

**MSS**
1. User requests to list all expenses.
1. Homerce shows a list of expenses.
1. User edits an existing expense by providing the details.
1. Homerce updates the details of the selected expense.
1. Homerce updates the expense list.
1. Homerce displays the updated list and a successful message.
Use case ends.

**Extensions**
* 3a. Invalid index provided.
  * 3a1. Homerce displays an error message.
  Use case resumes at step 1.

* 3b. Invalid details provided.
  * 3b1. Homerce displays an error message.
  Use case resumes at step 1.
```

#### UC023: Delete an Expense
Delete the selected expense from the expense list.

**System: Homerce**

**Actor: User**

**Preconditions: Expense exists in expense list.**

**Guarantees: Updated expense list with expense specified by user deleted.**

**MSS**
1. User requests to list all expenses.
1. Homerce shows a list of expenses.
1. User requests to delete a specific expenses.
1. Homerce deletes a expense.
1. Homerce displays the updated list.
1. Homerce displays a successful message.
Use case ends.

**Extensions**
* 3a. Invalid index provided.
  * 3a1. Homerce displays an error message.
  Use case resumes at step 1.

#### UC024: Find an Expense
Find an expense in the expense list.

**System: Homerce**

**Actor: User**

**Preconditions: Expense exists in expense list.**

**Guarantees: Display all expenses in the expense list that matches the search value.**

**MSS**
1. User requests to list all expenses that match the search value.
1. Homerce searches for expenses that match search value.
1. Homerce shows a list of all expenses that match the search value.
1. Homerce displays a message stating the amount of expenses listed.
Use case ends.

**Extensions**
* 2a. No expense matches the search value.
  * 2a1. Homerce displays an empty list.
  Use case resumes at step 4.

#### UC025: List Expenses
List all the expenses in the expense list.

**System: Homerce**

**Actor: User**

**Preconditions: Expense exists in expense list.**

**Guarantees: All expenses in the expense list will be displayed.**

**MSS**
1. User requests to list all expenses.
1. Homerce displays all expenses in the expense list.
1. Homerce displays a successful listed message.
Use case ends.

**Extensions**
* 1a. No expense in revenue list.
  * 1a1. Homerce displays an empty list.
  Use case resumes at step 3.

#### UC026: Clear Expenses
Clear all expenses in the expense list.

**System: Homerce**

**Actor: User**

**Preconditions: Expense list must exist.**

**Guarantees: An empty expense list.**

**MSS**
1. User requests to clear the list.
1. Homerce displays an empty list and a successful message.
Use case ends.

### Revenue Tracker

<div markdown="block">

#### UC027: Add a Revenue
Add a revenue earned by the business into Homerce.

**System: Homerce**

**Actor: User**

**Preconditions: Revenue list must exist.**

**Guarantees: A new revenue will be added to the revenue list upon marking the appointment as done.**

**MSS**
1. User <ins>mark appointment as done(UC019)</ins>.
1. Homerce adds the revenue generated from appointment to the revenue list.
1. Homerce displays a successful message.
Use case ends.
</div>

#### UC028: Delete an Revenue
Delete the selected revenue from the revenue list.

**System: Homerce**

**Actor: User**

**Preconditions: Revenue exists in revenue list.**

**Guarantees: Revenue specified by user deleted upon marking the appointment as undone.**

**MSS**
1. User <ins>mark appointment as done(UC019)</ins>.
1. Homerce remove the revenue generated from appointment to the revenue list.
1. Homerce displays a successful message.
Use case ends.

#### UC029: Find a Revenue
Find a revenue in the revenue list.

**System: Homerce**

**Actor: User**

**Preconditions: Revenue exists in revenue list.**

**Guarantees: Display all revenues in the revenue list that matches the search value.**

**MSS**
1. User requests to list all revenues that match the search value.
1. Homerce searches for revenues that match search value.
1. Homerce shows a list of all revenues that match the search value.
1. Homerce displays a message stating the amount of revenues listed.
Use case ends.

**Extensions**
* 2a. No revenue matches the search value.
  * 2a1. Homerce displays an empty list.
  Use case resumes at step 4.

#### UC030: List Revenues
List all the revenues in the revenue list.

**System: Homerce**

**Actor: User**

**Preconditions: Revenue exists in revenue list.**

**Guarantees: All revenues in the revenue list will be displayed.**

**MSS**
1. User requests to list all revenues.
1. Homerce displays all revenues in the revenue list.
1. Homerce displays a successful listed message.
Use case ends.

**Extensions**
* 1a. No revenue in revenue list.
  * 1a1. Homerce displays an empty list.
  Use case resumes at step 3.

#### UC031: Clear Revenues
Clear all revenues in the revenue list.

**System: Homerce**

**Actor: User**

**Preconditions: Revenue list must exist.**

**Guarantees: An empty revenue list.**

**MSS**
1. User requests to clear the list.
1. Homerce displays an empty list and a successful message.
Use case ends.


### Others

*{More to be added}*

## **Appendix D: Non-Functional Requirements**

* System Requirements:
    * Homerce should work on any _mainstream OS_ as long as it has Java `11` or above installed.
    * Homerce should be optimized for keyboard input and can function without the use of a mouse.
      However, a mouse would improve the user experience.
    * The computer running the Java Virtual Machine (JVM) should have sufficient disk space to
      accommodate the user's data stored in the system. It should also have sufficient RAM
      and CPU power to run the JVM smoothly.
* Performance Requirements:
    * Homerce should be able to start up and load existing the user's stored data sufficiently fast (< 10s).
    * Context switching / menu navigation through the use of either text commands or button clicks should be sufficiently fast (< 10s).
* Usability:
    * Homerce should be user-friendly for any client who can use a computer and does not require prior technical knowledge.
    * The user interface of Homerce should look intuitive and simple to navigate. It should not look cluttered with too many panels.
* Reliability:
    * Homerce should not crash in the event of incorrect user input - this should be handled safely with exceptions.
* Scalability:
    * Homerce should be able to handle thousands of appointments, clients, expenses and all other recorded entries by a user.
     No expansion of hardware capabilities or software modifications should be required.

## **Appendix E: Glossary**

* **Mainstream OS**: Windows, Linux, Unix, OS-X
* **Private contact detail**: A contact detail that is not meant to be shared with others
* **JVM**: Java Virtual Machine - Java code that is compiled is run in the virtual machine.
* **CRUD**: In computer programming, create, read, update, and delete (CRUD) are the four basic functions of persistent storage

## **Appendix F: Instructions for manual testing**

Given below are instructions to test the app manually.

<div markdown="span" class="alert alert-info">:information_source: **Note:** These instructions only provide a starting point for testers to work on;
testers are expected to do more *exploratory* testing.

</div>

### Launch and shutdown

1. Initial launch

   1. Download the jar file and copy into an empty folder

   1. Double-click the jar file Expected: Shows the GUI with a set of sample contacts. The window size may not be optimum.

1. Saving window preferences

   1. Resize the window to an optimum size. Move the window to a different location. Close the window.

   1. Re-launch the app by double-clicking the jar file.<br>
       Expected: The most recent window size and location is retained.

1. _{ more test cases …​ }_

### Deleting a client

1. Deleting a client while all clients are being shown

   1. Prerequisites: List all clients using the `list` command. Multiple clients in the list.

   1. Test case: `delete 1`<br>
      Expected: First contact is deleted from the list. Details of the deleted contact shown in the status message. Timestamp in the status bar is updated.

   1. Test case: `delete 0`<br>
      Expected: No client is deleted. Error details shown in the status message. Status bar remains the same.

   1. Other incorrect delete commands to try: `delete`, `delete x`, `...` (where x is larger than the list size)<br>
      Expected: Similar to previous.

1. _{ more test cases …​ }_

### Saving data

1. Dealing with missing/corrupted data files

   1. _{explain how to simulate a missing/corrupted file, and the expected behavior}_

1. _{ more test cases …​ }_

## Appendix G: Effort

{to be added...}
