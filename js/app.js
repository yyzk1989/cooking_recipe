function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

async function getRecipes() {
  const snapshot = await db.collection('recipes').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getRecipeById(id) {
  const snap = await db.collection('recipes').doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

async function addRecipe(data) {
  const ref = await db.collection('recipes').add({
    ...data,
    createdAt: new Date().toISOString().slice(0, 10)
  });
  return ref.id;
}

async function updateRecipe(id, data) {
  await db.collection('recipes').doc(id).update(data);
}

async function deleteRecipeById(id) {
  await db.collection('recipes').doc(id).delete();
}

async function getCategories() {
  const snap = await db.collection('config').doc('categories').get();
  if (snap.exists) return snap.data().list || [];
  const defaults = ["국/찌개", "반찬", "밥/면", "간식/디저트"];
  await saveCategories(defaults);
  return defaults;
}

async function saveCategories(list) {
  await db.collection('config').doc('categories').set({ list });
}
