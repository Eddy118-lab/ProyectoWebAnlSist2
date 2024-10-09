import Inventario from '../models/Inventario.js';
import Material from '../models/Material.js';

// Obtener todos los inventarios
export const getInventarios = async (req, res) => {
    try {
        const inventarios = await Inventario.findAll({
            include: {
                model: Material,
                as: 'material',
            },
        });
        return res.status(200).json(inventarios);
    } catch (error) {
        console.error('Error al obtener los inventarios:', error);
        return res.status(500).json({ message: 'Error al obtener los inventarios.' });
    }
};

// Obtener un inventario por ID
export const getInventarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const inventario = await Inventario.findByPk(id, {
            include: {
                model: Material,
                as: 'material',
            },
        });

        if (!inventario) {
            return res.status(404).json({ message: 'Inventario no encontrado.' });
        }

        return res.status(200).json(inventario);
    } catch (error) {
        console.error('Error al obtener el inventario:', error);
        return res.status(500).json({ message: 'Error al obtener el inventario.' });
    }
};

// Crear un nuevo inventario
export const createInventario = async (req, res) => {
    try {
        const { precio_unitario, cantidad, fecha_ingreso, stock_min, stock_max, material_id } = req.body;
        const nuevoInventario = await Inventario.create({ 
            precio_unitario, 
            cantidad, 
            fecha_ingreso, 
            stock_min, 
            stock_max, 
            material_id 
        });
        return res.status(201).json(nuevoInventario);
    } catch (error) {
        console.error('Error al crear el inventario:', error);
        return res.status(500).json({ message: 'Error al crear el inventario.' });
    }
};

// Actualizar un inventario
// Actualizar un inventario
export const updateInventario = async (req, res) => {
    try {
      const { id } = req.params;
      const { cantidad, fecha_ingreso } = req.body;
  
      const inventario = await Inventario.findByPk(id);
      if (!inventario) {
        return res.status(404).json({ message: 'Inventario no encontrado.' });
      }
  
      inventario.cantidad = cantidad;
      inventario.fecha_ingreso = fecha_ingreso;
      await inventario.save({ fields: ['cantidad', 'fecha_ingreso'] });
  
      return res.status(200).json(inventario);
    } catch (error) {
      console.error('Error al actualizar el inventario:', error);
      return res.status(500).json({ message: 'Error al actualizar el inventario.' });
    }
  };

// Eliminar un inventario
export const deleteInventario = async (req, res) => {
    try {
        const { id } = req.params;
        const inventario = await Inventario.findByPk(id);

        if (!inventario) {
            return res.status(404).json({ message: 'Inventario no encontrado.' });
        }

        await inventario.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el inventario:', error);
        return res.status(500).json({ message: 'Error al eliminar el inventario.' });
    }
};
