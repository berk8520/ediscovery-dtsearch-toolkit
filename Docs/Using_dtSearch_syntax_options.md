relativitynd5u5rpx

https://relativitynd5u5rpx.org.coveo.com/rest/search

https://help.relativity.com/RelativityOne/Content/CoveoSearch.htm

xx88c98343-663b-4c96-9a13-3982a84c240b



[Coveo Search Page](../../CoveoSearch.htm)
![Discussion](../../Resources/MasterPages/images/coveo/discussions.png)
![People](../../Resources/MasterPages/images/coveo/people.png)
![Documentation](../../Resources/MasterPages/images/coveo/documentation.png)
![Relativity Files](../../Resources/MasterPages/images/coveo/relativity-files.png)
![Ideas](../../Resources/MasterPages/images/coveo/ideas.png)
![Events](../../Resources/MasterPages/images/coveo/events_59x59.png)
![News](../../Resources/MasterPages/images/coveo/news.png)
![Discussion](../../Resources/MasterPages/images/coveo/discussions.png)

>>

Version: 

RelativityOne
Server 2025
Server 2024



Visit [Relativity Learning](https://learning.relativity.com/) to explore additional learning opportunities for this topic.

☰

Last date modified: 2026-May-01

# Using dtSearch syntax options

dtSearch includes special characters and other operators used to define search criteria. The following table lists the syntax options available for queries that run against a dtSearch index. Click the search functionality name for more details on the syntax use.

| Search functionality | Special characters or operators |
| --- | --- |
| [Auto-recognition of dates, emails, credit cards](#Auto-rec) | date(), mail(), creditcard() |
| [Boolean operators](#Boolean) | AND, OR, NOT |
| [Built-in search words](#Built-in) | xfirstword, xlastword |
| [Connector words](#Connector) | and, or, not, to, contains |
| [Exact phrase - double quotes](#Exact) | " " |
| [Exact phrase - no double quotes](#ExactNoDoubleQuotes) |  |
| [Operator precedence - no parenthesis](#Operator) |  |
| [Operator precedence - with parentheses](#Operator) | () |
| [Fuzzy searching](#Fuzzy) | % |
| [Noise words and the alphabet file](#Noise) | Noise Words, Alphabet |
| [Numerical patterns](#Numerica) | = |
| [Phonic searching](#Phonic) | # |
| [Regular expressions](../Regular_expressions/Using_regular_expressions_with_dtSearch.htm) (Redirects to another topic.) | "##" |
| [Stemming](#Stemming) | ~ |
| [Wildcards](#Wildcard) | ?, \* |
| [W/N operator](#W/N) | W/N |
| [Proximity with terms order](#PRE) | PRE |
| [Words and phrases](#WordsAndPhrases) |  |

For the list of the special characters recognized as spaces that cause word breaks, see [Noise words and the alphabet file](#Noise).

## Auto-recognition

Auto-recognition provides you with the ability to search for various date formats, email addresses, and credit card numbers. However, it can dramatically affect indexing and searching performance. You must activate auto-recognition before you can use it in your workspace. Contact your system administrator for more information.

### Date recognition

Date recognition searches for strings that appear to be dates. It uses English-language months, including common abbreviations, and numerical formats. For example, dtSearch recognized the following date formats:

* January 15, 2006
* 2006/01/15
* 1/15/06
* 1-15-06
* The fifteenth of January, two thousand six

The short month format, *Jan*, *Feb*, and so forth, can be problematic, and is occasionally rejected by Relativity. The recommendation is to stick with the full name of the month to avoid any errors. For example *January*, *February*, and so forth.

Note the following date and date range search strings:

* To search for a date, enter a date expression between the parentheses in the string date(); for example, date(january 10 2006).
* To search for range of dates, enter a date range between the parentheses in the string date(); for example, date(january 10 2006 to january 20 2006).
* To search for a range of dates near the word apple, enter date(january 10 2006 to january 20 2006) w/10 apple.
* dtSearch does not support unterminated date ranges. To search for any date after or before a particular date, enter a bounded range with a maximal or minimal value for the bounds. The maximum value for a year is 2900, and the minimum value is 1000. For example, date(january 10 2006 to january 1 2900).

dtSearch recognizes numeric strings as dates, as long as it interpretes as a valid date. This includes formats common in the US and UK, including:

* MM/DD/YY or MM-DD-YY
* MM/DD/YYYY or MM-DD-YYYY
* DD/MM/YY or DD-MM-YY
* DD/MM/YYYY or DD-MM-YYYY

In the case of ambiguous dates, such as 01/05/10, dtSearch defaults to MM/DD/YY. If the date contains words dtSearch converts the words to a numeric value to help interpret the date. For example, 30 must be a day and not a month, and 2015 must be a year, not a day or month.

### Email address recognition

Email address recognition searches for text with the syntax of a valid email address, such as sales@example.com. With this feature, you can search for a specific email address regardless of the alphabet settings for "@", ".", or other punctuation in the email address.

You can also use the word listing functions in dtSearch to enumerate all email addresses in a document collection. You must include either the \* or ? wildcard expression to enumerate all email addresses in a document collection.

* *mail(sales@example.com)* returns the exact email address: *sales@example.com*.
* *mail(sa\*@example.com)* returns variations of the email address: *sal@example.com*; *sales.sa@example.com*.

### Credit card number recognition

Credit card number recognition searches for any sequence of numbers that matches the syntax for a valid credit card number issued by a major company, such as Visa and MasterCard. dtSearch recognizes a credit card number regardless of the pattern of spaces or punctuation embedded in the number:

* 1234-5678-1234-5678
* 1234567812345678
* 1234 5678 1234 5678

Credit card issuers use numerical tests to exclude sequences of numbers that are not valid credit card numbers. Since these tests do not detect all invalid numbers, the feature for credit card number recognition may find additional invalid numbers.

To search for a credit card number, enter a credit card number between the parentheses in creditcard() as exemplified in creditcard(1234\*).

## Boolean operators

The dtSearch engine supports Boolean operators, including AND, OR, and NOT. You can use these operators to connect multiple phrases or terms in a single search expression.

When using Boolean operators in a proximity search, dtSearch includes noise words. Although not searchable, a proximity searches still counts noise words.

### AND operator

For details on parsing proximity and Boolean strings in search conditions, see [dtSearch - How are Proximity and Boolean (AND/OR) parsed in search conditions?](https://community.relativity.com/s/article/dtSearch---How-are-Proximity-and-Boolean-28AND2FOR29-parsed-in-search-conditions3F-2019-09-25230151Z) knowledge base article on the Relativity Community site.

When you use the AND operator to connect expressions, only documents that contain all the expressions in the search string return in the result set. The following search strings illustrate how to use this operator:

* apple pie AND poached pear retrieves any documents that contain both phrases.
* (apple or banana) AND (pear w/5 grape) retrieves any documents that contain apple or banana AND contain pear within five words of grape.

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See **AND** operator diagram](#)

![AND operator diagram](../../Resources/Images/Features/dtSearch/DGM_ANDOperator.png)

## Built-in search words

dtSearch includes the following built-in search words:

You can use these terms to limit a search to the beginning or end of a file. For example, apple W/10 xlastword searches for apple within 11 words of the end of a document.

* **xfirstword**—marks the beginning of a file.

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See **xfirstword** operator diagram](#)

![W/# xfirstword operator](../../Resources/Images/Features/dtSearch/DGM_WithinNumberFirstWord.png)

* **xlastword**—marks the end of a file.

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See **xlastword** operator diagram](#)

![W/# xlastword operator](../../Resources/Images/Features/dtSearch/DGM_WithinNumberLastWord.png)

## Connector words

The dtSearch connector words include:

* and
* or
* not
* to
* contains

To search for a phrase that contains one of the dtSearch connector words, quote a connector word or the phrase it is in, or put a tilde after the connector. The following search strings work in returning phrases that contain connector words:

* "clear and convincing evidence"
* not~ relevant
* "whether or not John wants to"

Note the following:

* Adding a ~ after a connector word prevents dtSearch from recognizing the word as a connector but does not otherwise affect the search. The ~ character after a word tells dtSearch to apply the stemming rules to it. Because the stemming rules included with dtSearch do not modify short words, the ~ does not change the outcome of a search for and, or, not, or to.
* The noise word list includes connector words such as *and* and *not* by default. All these words are noise words and you must remove these words from the list to make dtSearch index these files. See [Creating a dtSearch index](dtSearch.htm#Creating) for details.
* Relativity does not support the dtSearch contains connector functionality. The word *contains* must also be treated separately to be searched.

## Exact phrase - double quotes

You must use double quotes when searching for exact phrases that contain dtSearch operator reserved words, such as the Boolean connectors AND, OR. For example:

Connector words such as and and not are in the noise word list by default. All these words are noise words and you must remove these words from the list to make dtSearch index these files

**Search string**: *clear and present danger*

* Returns documents that contain both the word clear and the phrase present danger.
* If you need to return documents that contain the exact phrase clear and present danger, you must:
  1. Remove the word and from the dtSearch noise words list.
  2. Surround the search string with "double quotes" so that the word AND is not treated as a Boolean connector.

**Search string**: *"clear and present danger"*

* Returns the exact phrase clear and present danger.

Do not confuse the parentheses function for order of preference with the double quotes function.

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See **exact phrase** diagram](#)

![Exact phrase dtSearch diagram](../../Resources/Images/Features/dtSearch/DGM_ExactPhrase.png)

### AndAny operator

You can combine a search for required search terms with other optional terms. The words before the AndAny connector constitute required search terms, and the words after the AndAny connector are optional. A document only returns if it contains at least the required search terms. For example, (apple and pear) AndAny (grape or banana) would find any document that contains apple and pear, with grape and banana also counts as hits only if apple and pear are also present in the document.

The following example further explains the AndAny operator:

You have three documents, each containing the terms specified below:

* Document 1: Apple
* Document 2: Apple, Grape, Pear
* Document 3: Grape, Pear

Note the following behavior:

* When you search for the term *apple*, documents 1 and 2 return.
* When you search for the string *apple* AND *pear*, only document 2 returns.
* When you search for the string *apple* AndAny *pear*, documents 1 and 2 return.

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See **AndAny** operator diagram](#)

![AndAny operator diagram](../../Resources/Images/Features/dtSearch/DGM_AndAnyOperator.png)

### OR operator

When you use the OR operator to connect expressions in a search string, documents that contain one or more of these expressions return in the result set. For example, the search string apple pie or poached pear returns documents that contain apple pie, poached pear, or both phrases.

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See **OR** operator diagram](#)

![OR operator diagram](../../Resources/Images/Features/dtSearch/DGM_OROperator.png)

### NOT operator

In a dtSearch, you can use the NOT operator at the beginning of a search expression to negate its meaning and exclude documents from a result set. For example, the search expression applesauce and NOT pear returns documents that contain the word applesauce, but not those documents that contain both the words applesauce and pear.

* **NOT operator as a standalone**—you can use the NOT operator by itself at the beginning of a search expression. For example, the search expression NOT pear returns all the documents that do not contain the word pear. The search expression NOT (apple w/5 pear) returns all the documents that do not contain the word apple within five words of pear. Other examples:
  + NOT (apple or pear) returns every document that does not have apple or pear in it.
  + NOT (apple and pear) returns documents where apple and pear do not appear together in the same document. It returns all other documents including documents with the word apple and documents with the word pear. It does not return documents that include both terms.
* **NOT operator as a connector**—when the NOT operator appears in the middle of a search expression, you must also use either AND or OR. For example, the search expression apple OR NOT pear returns all the documents that contain the word apple and those that do not contain the word pear.

  You can also use NOT in a proximity search as illustrated by the NOT W/N, NOT Within N words, operator. See [W/N operator](#W/N).
* **AND NOT operator**—you can use the AND NOT operator to develop queries for documents that include the first expression but not the second expression. For example, you may want to query for email messages that have Ryan as the author, but do not have Will as the recipient. The following record illustrates these conditions:

  | Document | OCR | Recipient | Author |
  | --- | --- | --- | --- |
  | AS00001 | From: Ryan To: Will | Will | Ryan |

  + You can perform a dtSearch using the search string Ryan AND NOT Will and return results that do not include document AS00001.
  + The dtSearch engine combines into a single pool the text for all fields identified for inclusion in an index. A search string using the AND NOT operator queries the index that includes the combined text from all indexed fields, rather than querying the content of individual fields. This behavior ensures consistent result sets when querying with the AND NOT operator.

    A keyword search is an SQL full text search, which queries individual fields. Keyword searches do not return the same results as dtSearch when using the NOT operator to query across multiple fields. See [NOT operator](#NOT).

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See **NOT** operator diagram](#)

![AND NOT operator](../../Resources/Images/Features/dtSearch/DGM_AndNotOperator.png)

### Operator precedence - no parentheses

The precedence, or order of evaluation, determines how a group of expressions evaluates in a query.

By default, dtSearch evaluates OR expressions before AND expressions: A AND (B OR C). Unlike dtSearch, the order of precedence for a keyword search evaluates AND expressions before OR expressions: (A AND B) OR C. See [Keyword search](../Keyword_search.htm).

Evaluation order for the search string: *apple AND pear OR grape*

* pear OR grape evaluates first
* AND apple evaluates second

Documents containing the following terms return:

* pear, grape, apple
* pear, apple
* grape, apple

### Operator precedence - with parentheses

Parentheses allow you to group expressions and control the order of query string execution where the query string contains both AND and OR operators. dtSearch requires both AND and OR operators for the parentheses to affect query results and ignores parentheses when the query string does not contain both operators.

For query strings containing both AND and OR operators, dtSearch evaluates OR first before AND. However, expressions contained within parentheses take precedence. If you want AND evaluated before OR, place the AND expression within parentheses.

Evaluation order for the search string: *grape OR (apple AND pear)*

* *apple AND pear* evaluated first as they reside within the parentheses
* *OR grape* evaluated second

dtSearch returns documents containing the following terms:

* apple, pear, grape
* apple, pear
* grape

### Workaround for expressions containing only AND or OR operators

Use a proximity operator to separate query expressions. For example, insert a PRE proximity operator between each expression of the search string.

Evaluation of the search phrase: *(grape OR apple) PRE/1 (banana OR pear)*

dtSearch returns documents containing the following terms:

* grape banana
* grape pear
* apple banana
* apple pear

Evaluation of the search phrase: *(grape OR apple) (banana OR pear)*

dtSearch ignores the parentheses and analyzes the query as *grape OR apple banana OR pear* and returns documents with the following terms:

* grape
* apple banana
* pear
* grape, apple banana, pear

## Exact phrase - no double quotes

Searching for words next to each other with no operator between them constitutes an exact phrase in dtSearch. For example, if you search for apple pear, dtSearch returns documents that contain the exact phrase apple pear. There is no rule that requires double quotes around a phrase of any number of words. You only need to use double quotes when searching for a word that is a dtSearch operator. For more details, see [Exact phrase - double quotes](#Exact).

**Search string**: *pear orange*

* Returns the exact phrase: *pear orange*
* Does not return standalone word: *pear*
* Does not return standalone word: *orange*

**Search string:** *apple grape banana*

* Returns the exact phrase: *apple grape banana*
* Does not return partial phrase: *apple grape*
* Does not return standalone word: *grape banana*

## Fuzzy searching

Using the dtSearch engine, you can perform fuzzy searches, which return documents containing spelling variations of a specified term. You may want to use fuzzy searching when querying documents that contain misspelled terms, typographical errors, or you have scanned with Optical Character Recognition (OCR).

Fuzzy searching is not supported in Search Terms Reports (STR). You must use the Dictionary function to perform fuzzy searching. You would then add the desired terms to the STR. For information on how to use the Dictionary, see [Running a Dictionary search](Running_a_Dictionary_search.htm).

The percent sign (%) is the character used for fuzzy searches. The number of % used indicates how many characters in the search term dtSearch engine ignores when it runs the query. The position of the % indicates the number of characters from the beginning of the term that must match exactly with words in the result set. The following search strings illustrate how to use this character:

* app%ly indicates that a matching word must begin with app and differ from apply by only one character.
* a%%pply indicates that a matching word must begin with a and differ from apply by only two characters.

If you want to search for the literal percentage (**%**) character in documents, see [Example: Searching for percentage (%) terms in documents](Searching_for_symbols.htm#Example:).

### Using the fuzziness operator and fuzziness level option

In Relativity, you can use the fuzziness character (%) or the **Fuzziness Level** menu to perform fuzzy searches. The availability of these search options depends on the location where you are running a dtSearch:

* **Documents tab**—when you select a dtSearch in the **Search With** option, you can use the fuzziness character (%). See [Running a dtSearch](Running_a_dtSearch.htm).
* **Dictionary Search**—when you click the **Dictionary** link, you can use the fuzziness character (%) and the **Fuzziness Level** menu on the Dictionary Search dialog. See [Running a Dictionary search](Running_a_Dictionary_search.htm).  
  In the **Fuzziness Level** menu, you can select a value from 1 to 10, which applies to all terms in the text box. Larger numbers return terms with more variation. We recommend using values between 1-3 for moderate error tolerance. The following table describes the expected results for sample settings.  

  | Fuzziness level | Description of search results |
  | --- | --- |
  | Blank | Only returns the entered term. |
  | 1 | Returns slight variations of the entered term. |
  | 4 | Returns multiple variations of the entered term. |
* **Saved Search**—when you create a saved search, you can use the fuzziness operator (%) and the **Fuzziness Level** menu when you add a dtSearch index condition or by clicking the **Dictionary** link. The **Fuzziness Level** menu in a saved search uses the same settings as described above. See [Saved search](../Saved_search/Saved_search.htm).

  The **Fuzziness Level** menu is independent of the fuzziness (%) character that you can enter in the text box. A search for appl% without a *Fuzziness Level* setting may return documents containing apple or apply, since these terms have the stem appl and differ by one character.

Fuzzy searching uses term length and fuzziness level to decide how many % characters to add. This is not a straight level to character match. This means a level seven fuzziness search does not necessarily mean up to seven additional characters return.

## Noise words and the alphabet file

The dtSearch engine references a default list of noise words and an alphabet file when it creates a new index. The dtSearch index excludes the noise words to improve query performance and prevent unnecessary index growth. When you run a query, dtSearch ignores words such as AND, THE, and WILL. The alphabet file determines how queries handle characters and spaces.

If your dtSearches do not return expected results, you may want to contact your system administrator to adjust the noise word list or alphabet file.

### Alphabet file

The dtSearch engine uses an alphabet file to define which characters to treat as text, cause word breaks, and ignore. System administrators can modify the default alphabet file when they create or edit a dtSearch index. See [Making a special character searchable](#Making).

The alphabet file determines which characters to treat as text, which cause spaces, which cause word breaks, and which to ignore. The categories of items in the alphabet file include:

* **Letters**—all searchable characters, which should include all alphabet characters, a-z and A-Z, and all digits, 0-9.
* **Hyphens**—characters removed during index creation. For example *First-Level* becomes two separate words in a dtSearch index.
* **Spaces**—characters that cause a word break. For example, the period indexes as a space character by default. Thus, dtSearch processes U.S.A. as three separate words: U, S, and A. Values listed as \## are Unicode characters. Their definitions are:
  + \09—horizontal tab
  + \0a—line feed
  + \0c—form feed
  + \0d—carriage return
  + \5c—backslash (\)

  Do not remove these Unicode characters from your alphabet file.
* **Ignore**—characters that dtSearch should disregard in processing text. For example, if you classify the period as ignore instead of space, then dtSearch would process U.S.A. as one word, USA.

dtSearch does not recognize the underscore (\_) as a space by default. Check the [Spaces] section to ensure that any character you want to treat as a word separator is properly defined in dtSearch.

### Default noise word list

The following table shows the default noise words list. System administrators can modify this list when they create or edit a dtSearch index. Thus, if you search for a phrase that contains a term in the noise words list, you need to remove the term from the list and rebuild your index. See [Creating a dtSearch index](dtSearch.htm#Creating).

| Begins with... | Noise words |
| --- | --- |
| A | a, about, after, all, also, an, and, another, any, are, as, at |
| B | be, because, been, before, being, between, both, but, by |
| C | came, can, come, could |
| D | did, do |
| E | each, even |
| F | for, from, further, furthermore |
| G | get, got |
| H | had, has, have, he, her, here, hi, him, himself, his, how, however |
| I | i, if, in, indeed, into, is, it, its |
| J | just |
| L | like |
| M | made, many, me, might, more, moreover, most, much, must, my |
| N | never, not, now |
| O | of, on, only, or, other, our, out, over |
| S | said, same, see, she, should, since, some, still, such |
| T | take, than, that, the, their, them, then, there, therefore, these, they, this, those, through, thus, to, too |
| U | under, up |
| V | very |
| W | was, way, we, well, were, what, when, where, which, while, who, will, with, would |
| Y | you, your |

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See a noise words diagram](#)

![Noise words diagram](../../Resources/Images/Features/dtSearch/DGM_NoiseWordsInPhrase.png)

### Making a special character searchable

You can make special characters searchable in a dtSearch index. However, you must escape some characters when using regular expressions. For more information, see [Searching for symbols](Searching_for_symbols.htm).

1. Navigate to the **dtSearch index**.
2. Click **Edit**, and then scroll down to the Alphabet section.
3. Delete the character from the current category, such as *hyphen* or *spaces*. Do not delete the category heading.
4. Enter the character you want to make searchable four times, separated by spaces under the section **[Letters] // Original letter, lower case, upper case, unaccented**.

   You must also begin with a space.

   ![A example of how to make special characters searchable in the alphabet list.](../../Resources/Images/Features/dtSearch/SCR_dtSearchEditingAlphabetList.png)
5. Perform a full build on the dtSearch index. The search now adds the characters you included.

If you make any symbol a searchable character in your dtSearch index and then build an index on a long, uninterrupted search string, such as a file path, dtSearch truncates the string after the 32nd character. For more information, see [Searching for words longer than 32 characters](Running_a_dtSearch.htm#Searchin).

## Numerical patterns

To search for other numerical patterns, such as social security numbers, you can use the = wildcard, which matches any single digit. For example, if you include hyphens as spaces, then the following search request would find United States social security numbers:

=== == ====

This searching pattern can return false hits. For example, no valid social security number begins with nine. However, this is the only way to get social security numbers with spaces instead of dashes.

dtSearch support notes that the === == ==== notation is higher performing than a regular expression for the same pattern, assuming you are comfortable with getting some false hits.

## Phonic searching

Using the dtSearch engine, you can perform phonic searching, which returns documents containing words that sound like the word you are searching for and begins with the same letter. The pound sign (#) is the character used for phonic searches when added to the front of a word. For example, a phonic search for pear also finds pair and pare.

You can also use phonic searching in Dictionary searches.

## Stemming

Using the dtSearch engine, you can perform stemming searches, which return documents containing grammatical variations of a root word. Stemming limits to English only. The tilde (~) is the character used for stemming searches when added at the end of the root word. For example, a search on apply~ returns documents containing the words apply, applying, applies, and applied. After you perform a stemming search, you can enter applied in the **Find Next** box, and then click the **Find Next** icon to locate hits or grammatical variations.

Because stemming only works with the root word, it generally does not return irregular variations of a verb. For example, a search on run~ would not return ran. The dtSearch engine only supports stemming for the English language.

### Using the stemming operator and enable stemming checkbox

In Relativity, you can use the stemming character (~) or the **Enable Stemming** checkbox to perform stemming searches. The availability of these search options depends where you are running a dtSearch:

* **Documents tab**—when you select a dtSearch in the **Search With** option, you can use the stemming character (~). See [Running a dtSearch](Running_a_dtSearch.htm).
* **Dictionary Search**—when you click the **Dictionary** link, you can use the stemming character (~) and the **Enable Stemming** checkbox on the Dictionary Search dialog. See [Running a Dictionary search](Running_a_Dictionary_search.htm).
* **Saved Search**—when you create a saved search, you can use the stemming character (~) and the **Enable Stemming** checkbox in the Search Conditions section of the form. See [Saved search](../Saved_search/Saved_search.htm).

The **Enable Stemming** checkbox is independent of the stemming (~) character that you can enter in the **Search Terms** box or **Dictionary Search** text box. A search for apply~ with **Enable Stemming** checkbox unselected returns apply, applied, applies, or applying. A search for apply with **Enable Stemming** checkbox selected returns the same results.

### Using fuzzy searching and stemming together

With fuzzy searching *and* stemming enabled, it checks for a fuzzy match twice, once on the original term, and once comparing the stemmed word with the stemmed word in the index. A match on either counts as a hit.

## Wildcards

The dtSearch engine supports special characters that you can use as wildcards. It also supports the use of leading wildcards, or those added to the beginning of a word. The following characters represent wildcards in dtSearches:

| Special character | Function |
| --- | --- |
| ? | Matches any single unknown character in the specified position in a word. Must be a character and not a blank or empty space. |
| \* | Matches any number of unknown characters in a word, including a blank or empty space.  This character slows searches when used near the beginning or middle of a word. |
| ~ | Matches words containing grammatical variations of a root word. The tilde (~) is the stemming character available in dtSearches. See [Stemming](#Stemming). |
| = | Matches any single numerical digit. Use multiple equal (=) signs to match a particular numerical pattern. See [Numerical Patterns.](#Numerica) |

As illustrated in the following table, you can add wildcards to the root of any word to return matching terms from a dtSearch.

| Sample search string | Description of search results |
| --- | --- |
| appl? | Matches apply and apple, but not apples. |
| folder? | Matches folders, but not folder. |
| pe?r | Matches pear, peer |
| ?ear | Matches pear, dear, hear |
| appl\* | Matches appl, apple, apples, application. |
| \*cipl\* | Matches principle, participle, disciplined. |
| ap\*ed | Matches applied, approved, appeased |
| apply~ | Matches apply, applied, applies. |
| =th | Matches 4th, 5th, 6th. |
| === == ==== | Matches United Stages Social Security Numbers (hyphens represented as spaces) |

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See a \* wildcard diagram](#)

![Asterisk wildcard diagram](../../Resources/Images/Features/dtSearch/DGM_AsteriskWildcard.png)

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See a ? wildcard diagram](#)

![Question mark wildcard diagram](../../Resources/Images/Features/dtSearch/DGM_QuestionMarkWildCard.png)

## W/N operator

You can use the W/N (within Number of) operator to return documents with two words or phrases occur within a certain number of each other. The N value represents the number of intervening words. When using Boolean operators in a proximity search with the W/N operator, dtSearch includes noise words. For example, the search expression apple W/5 pear returns documents that contain apple only when it occurs within five words of pear. The documents returned by the search must contain the terms within the required proximity, such as five words.

The W/N operator is symmetrical. The search expression apple W/5 pear returns the exact same document as pear W/5 apple.

dtSearch treats Single characters as full words when using this operator. For instance, if you search for Harry W/2 Truman, your search retrieves documents that include Harry S Truman or Harry S. Truman.

Relativity does not support the WI operator. Use the W/N syntax to search for documents having words or phrases within a certain proximity of each other.

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See a W/N operator diagram](#)

![W/# operator](../../Resources/Images/Features/dtSearch/DGM_WithinNumberOperator.png)

### NOT W/N

You can use the NOT W/N (not within N of) operator to exclude documents from a result set when two words or phrases are within a certain proximity of each other.

For example, the search expression apple NOT W/20 pear returns documents that contain apple when separated from pear by at least 20 words. It also returns documents that do not contain pear. Documents that contain *apple* separated from pear multiple times with varying proximity return as long as there is at least one concurrence where apple separates from pear by at least 20 words.

The NOT W/N is not symmetrical. The search expression apple NOT W/20 pear does not return the same documents as pear NOT W/20 apple.

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See a NOT W/N operator diagram](#)

![NOT W/# operator diagram](../../Resources/Images/Features/dtSearch/DGM_NotWNOperator.png)

### Complex expressions

You can create complex expressions with the W/N (within Number of) operator by connecting multiple simple expressions containing words or phrases. To avoid ambiguous search requests when combining multiple simple expressions into one complex expression, make sure at least one of the simple expressions does not contain the AND operator. It should use a single word or phrase, or a group of words or phrases, connected by an OR operator, as illustrated below. You can break up complex expressions with OR connectors into separate searches. Search apple w/10 "orange tree" OR banana w/10 "orange tree" to return the same results as (apple OR banana) W/10 "orange tree".

* (apple AND banana) W/10 (pear OR grape)
* (apple AND banana) W/10 (orange tree)

Avoid creating complex expressions that produce ambiguous results, as illustrated in the following examples. dtSearch displays a warning message when you enter an ambiguous search request.

* (apple AND banana) W/10 (pear AND grape)
* (apple w/10 banana) w/10 (pear and grape)

You can also use the Boolean operators AND and OR to connect proximity expressions as illustrated in the following examples. When connecting proximity expressions using Boolean operators, you must use parentheses.

* (apple w/10 banana) AND (pear w/5 grape)
* (apple or banana) OR (pear w/5 grape)

### Proximity with terms order

You can use the PRE operator to search for a word that appears within a certain number of words before another word.

For example, the search string apple PRE/5 pear returns documents where apple appears within five words before pear.

Relativity does not use the POST operator. However, you can mimic this functionality by reversing the order of the terms, and using the PRE operator.

[![Closed](../../../Skins/Default/Stylesheets/Images/transparent.gif)See a PRE operator diagram](#)

![PRE/# operator diagram](../../Resources/Images/Features/dtSearch/DGM_PreNumberOperator.png)

## Words and phrases

With a dtSearch, you can use double quotes to search for a phrase. For example, the phrase fruit salad in the search string apple w/5 "fruit salad". The following list outlines how dtSearch queries on words or phrases with noise words or punctuation:

* **Phrases with Noise Words**—dtSearch skips any noise words in a phrase. For example, it skips of in the search string Statue of Liberty and retrieves any documents that contains statue an intervening word, and liberty.
* **Words with Punctuation**—punctuation treated as a space when inside a word. For example, dtSearch treats the search term can't as two words, can and t.
* **Numbers and Characters in Parenthesis**—you may see unexpected results when you use numbers or characters in parenthesis in a dtSearch. For example, the search term 1843 (c)(8)(ii) returns as four words.

## Other considerations

* dtSearch does not recognize an underscore (\_) by default. You must add the underscore to the Spaces section if you want it to be considered a space in dtSearch. For more information, see [Alphabet file](#Alphabet).
* Relativity does not use the colon (:) or ampersand (&), even though considered a syntax term by the dtSearch index. If you want to use these symbols, the following applies:
  + To include either symbol in the dtSearch index, you must add it to the alphabet
    file. For more information, see [Searching for symbols](Searching_for_symbols.htm).
  + To search for either symbol within file content, you must use a regular
    expression to define the character. Searching for special characters on their
    own produces incorrect results.
* dtSearch indexes are case insensitive by default. All characters in a dtSearch index normalize to lowercase. Relativity does not support case-sensitive dtSearch indexes. For example, if your exact phrase is an acronym like *ACT*, these will be included in the index: *act*, *AcT*, *aCt*, and similar. See [Case-insensitive indexes](dtSearch_index.htm#Case-ins) for more information.
* For more information on making noise words and alphabet lists searchable, see [Making the dtSearch noise word and alphabet list searchable](Making_the_stop_word_and_alphabet_list_searchable.htm).

**On this page**

* [Using dtSearch syntax options](#UsingdtSearchsyntaxoptions)
  + [Auto-recognition](#Autorecognition)
    - [Date recognition](#Daterecognition)
    - [Email address recognition](#Emailaddressrecognition)
    - [Credit card number recognition](#Creditcardnumberrecognition)
  + [Boolean operators](#Booleanoperators)
    - [AND operator](#ANDoperator)
  + [Built-in search words](#Builtinsearchwords)
  + [Connector words](#Connectorwords)
  + [Exact phrase - double quotes](#Exactphrasedoublequotes)
    - [AndAny operator](#AndAnyoperator)
    - [OR operator](#ORoperator)
    - [NOT operator](#NOToperator)
    - [Operator precedence - no parentheses](#Operatorprecedencenoparentheses)
    - [Operator precedence - with parentheses](#Operatorprecedencewithparentheses)
    - [Workaround for expressions containing only AND or OR operators](#WorkaroundforexpressionscontainingonlyANDorORoperators)
  + [Exact phrase - no double quotes](#Exactphrasenodoublequotes)
  + [Fuzzy searching](#Fuzzysearching)
    - [Using the fuzziness operator and fuzziness level option](#Usingthefuzzinessoperatorandfuzzinessleveloption)
  + [Noise words and the alphabet file](#Noisewordsandthealphabetfile)
    - [Alphabet file](#Alphabetfile)
    - [Default noise word list](#Defaultnoisewordlist)
    - [Making a special character searchable](#Makingaspecialcharactersearchable)
  + [Numerical patterns](#Numericalpatterns)
  + [Phonic searching](#Phonicsearching)
  + [Stemming](#Stemming)
    - [Using the stemming operator and enable stemming checkbox](#Usingthestemmingoperatorandenablestemmingcheckbox)
    - [Using fuzzy searching and stemming together](#Usingfuzzysearchingandstemmingtogether)
  + [Wildcards](#Wildcards)
  + [W/N operator](#WNoperator)
    - [NOT W/N](#NOTWN)
    - [Complex expressions](#Complexexpressions)
    - [Proximity with terms order](#Proximitywithtermsorder)
  + [Words and phrases](#WordsAndPhrases)
  + [Other considerations](#Otherconsiderations)

[![Return to top of the page](../../Resources/MasterPages/images/icon_top_gray.png)](# "back to top")

![Yes](../../Resources/Images/Icons/ICN_ThumbUp_25x25.png)

Feedback

![No](../../Resources/Images/Icons/ICN_ThumbDown_25x25.png)

---

Why was this not helpful?

Check one that applies.

I could not find the information I was looking for.

The information was incorrect.

The instructions are confusing or unclear.

The instructions did not work.

**Thank you for your feedback.**

Want to tell us more?

Name (Optional):

Email (Optional):

Message (Required):

---

Great!  

Thanks for taking the time to provide feedback.

Name (Optional):

Email (Optional):

Message (Required):

* [What's new](https://help.relativity.com/RelativityOne/Content/What_s_New/What_s_new_in_RelativityOne.htm)
* [Release notes](../../What_s_New/Release_notes.htm)
* [Known issues](../../What_s_New/Known_issues_list.htm)

* [Getting started](https://help.relativity.com/RelativityOne/Content/Getting_Started/Getting_started_in_RelativityOne.htm)
* [Sandbox environment](../../Getting_Started/RelativityOne_Sandbox.htm)
* [More >](../../Getting_Started/Getting_started_in_RelativityOne.htm)

* [Data Transfer](https://help.relativity.com/RelativityOne/Content/Site_Resources/Data_transfer.htm)
* [RelativityOne Staging Explorer](../RelativityOne_Staging_Explorer/RelativityOne_Staging_Explorer.htm)
* [Utility Server](../Utility_Server.htm)

* [Capabilities](https://help.relativity.com/RelativityOne/Content/Site_Resources/Products.htm)
* [Analytics](../Analytics/Analytics.htm)
* [Processing](../Processing/Processing_in_Relativity.htm)
* [More >](../../Site_Resources/Products.htm)

* [Resources](https://help.relativity.com/RelativityOne/Content/Site_Resources/Resources.htm)
* [Relativity A-Z](../../Site_Resources/Relativity_A-Z.htm)
* [PDF Downloads](../../Site_Resources/PDF_Downloads/R1_PDF_Downloads.htm)
* [Getting started](../../Getting_Started/Getting_started_in_RelativityOne.htm)
* [RelativityOne downtime windows](../../Getting_Started/RelativityOne_downtime_windows.htm)
* [Relativity Learning](https://learning.relativity.com/)
* [More >](../../Site_Resources/Resources.htm "More Resource topics")

* [Contact us](https://www.relativity.com/contact-us/)
* [1-312-263-1177](tel:1-312-263-1177)
* **231 South LaSalle Street
  20th Floor
  Chicago, IL 60604**


![Relativity logo](../../Resources/Images/Shared/footer-logo-2x_50x54.png)

* © Relativity
* [Privacy and Cookies](https://www.relativity.com/privacy-and-cookies/)
* [Terms of Use](https://www.relativity.com/terms-of-use/)



Recently released  
• [aiR for Review: Confidential Business Information (CBI)](https://help.relativity.com/RelativityOne/Content/Relativity/aiR_for_Review/Developing_prompt_criteria.htm#ConfidentialBusinessInformationtab)  
• [Fact Navigator - Edit Capabilities](https://help.relativity.com/RelativityOne/Content/Relativity/aiR_for_Case_Strategy/Fact_Navigator.htm#Editingafact)  
• [M365 Inactive Mailbox](https://help.relativity.com/RelativityOne/Content/Collect/Data_sources/Microsoft_365_-_Inactive_mailboxes.htm)  
• [aiR for Review: Job Size Kickoff Restriction](https://help.relativity.com/RelativityOne/Content/Relativity/aiR_for_Review/Monitoring_aiR_for_Review_jobs.htm#SettingaiRforReviewjobsizelimits)  

For more, see the [Whats New](../../What_s_New/What_s_new_in_RelativityOne.htm) section