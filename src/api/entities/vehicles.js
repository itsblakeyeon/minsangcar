import { supabase } from '../supabaseClient';

export const vehiclesApi = {
  async list() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('차량 목록 조회 실패:', error);
      throw error;
    }
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('차량 조회 실패:', error);
      throw error;
    }
    return data;
  }
};
