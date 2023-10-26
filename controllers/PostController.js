const PostModel = require("../models/Post");

const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      viewsCount: req.body.viewsCount,
      user: req.userId,
      imageUrl: req.body.imageUrl,
    });

    const post = await doc.save();
    res.json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "не удалось создать статью" });
  }
};

const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "не удалось получить статьи" });
  }
};

const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log(postId);
    //это все делается для обновления просмотра! можно сделать просто findOne и вернуть
    const readyDoc = await PostModel.findOneAndUpdate({ _id: postId }, { $inc: { viewsCount: 1 } }, { new: true });

    if (!updatedDoc) {
      return res.status(404).json({
        message: "Статья не найдена ",
      });
    }
    res.json(readyDoc);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "не удалось вернуть статью" });
  }
};

const removeOne = async (req, res) => {
  try {
    const postId = req.params.id;

    //это все делается для обновления просмотра! можно сделать просто findOne и вернуть
    const deletedDoc = await PostModel.findOneAndDelete({ _id: postId });

    if (!deletedDoc) {
      return res.status(404).json({
        message: "Статья не найдена ",
      });
    }

    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "не удалось вернуть статью" });
  }
};

const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      }
    );

    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "не удалось обновить статью" });
  }
};

module.exports = { create, getAll, getOne, removeOne, update };
