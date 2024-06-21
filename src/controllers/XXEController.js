
const xml2js = require('xml2js');
const path = require('path');
const fs = require('fs');

exports.submitComment = (req, res) => {
    const { comment } = req.body;

    
    const parser = new xml2js.Parser({
        explicitArray: false,
        ignoreAttrs: false,
        normalizeTags: true,
        explicitRoot: true,
        dtd: true 
    });

    parser.parseString(comment, (err, result) => {
        if (err) {
            return res.status(400).json({ message: 'Error al procesar el comentario', error: err.message });
        }

        
        const sensitiveData = result.comment?.data;

        if (sensitiveData) {
            res.json({ message: 'Desafío completado: Se ha accedido a datos sensibles', data: sensitiveData });
        } else {
            res.json({ message: 'Comentario recibido. Intenta acceder a datos sensibles.', data: result });
        }
    });
};

exports.getComments = (req, res) => {
    const comments = [
        { id: 1, username: 'elmodo2024', content: 'bin boot dev etc home initrd.img initrd.img.old lib lib32 lib64 lost+found media mnt opt proc root run sbin srv swapfile sys tmp usr var vmlinuz vmlinuz.old' },
        { id: 2, username: 'webgoat', content: 'Silly cat....' },
        { id: 3, username: 'guest', content: 'I think I will use this picture in one of my projects.' },
        { id: 4, username: 'guest', content: 'Lol!! :-).' }
    ];
    res.json({ comments });
};
