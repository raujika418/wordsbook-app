const db_command = {
  bookListQuery: `Select wb.ID, wb.WORDSBOOKS_NAME, l.LANG_DISPLAY_NAME from WORDSBOOKS wb, LANG l where wb.LANG_ID = l.ID`,
  bookQuery: (book_id: number) =>
    `Select l.ID as lang_id, wb.WORDSBOOKS_NAME as name, l.LANG_DISPLAY_NAME as lang from WORDSBOOKS wb,LANG l  where wb.LANG_ID = l.ID and wb.ID = ${book_id}`,
  langListQuery: `Select ID as key, LANG_CODE, LANG_DISPLAY_NAME as value from LANG`,
  wordsBookUpdate: (wbid: number, name: string, lang: number) =>
    `UPDATE WORDSBOOKS SET WORDSBOOKS_NAME = '${name}' ,LANG_ID = ${lang} where ID=${wbid}`,
  bookListCreate: (name: string, lang: number) =>
    `INSERT INTO WORDSBOOKS (WORDSBOOKS_NAME, LANG_ID ) VALUES ('${name}', ${lang});`,
  bookListDelete: (bid: number) => `DELETE FROM WORDSBOOKS WHERE ID=${bid}`,
  wordsListQuery: (wbid: number) =>
    `Select w.ID as ID, w.WORDS_TEXT as TEXT, w.WORDS_TEXT_TRANSLATED as TEXT_TRANS, w.DES as DES from WORDS w where w.WORDSBOOK_ID = ${wbid}`,
  wordsListInsert: (wbid: number, w: string, wt: string, des: string) =>
    `INSERT INTO WORDS (WORDSBOOK_ID, WORDS_TEXT, WORDS_TEXT_TRANSLATED, DES) VALUES ` +
    `(${wbid}, '${w}', '${wt}', '${des}')`,
  wordsListUpdate: (wid: number, w: string, wt: string, des: string) =>
    `UPDATE WORDS SET WORDS_TEXT='${w}', WORDS_TEXT_TRANSLATED='${wt}', DES='${des}' where ID=${wid}`,
  wordsListDelete: (wid: number) => `DELETE FROM WORDS WHERE ID=${wid}`,
};

export default db_command;
