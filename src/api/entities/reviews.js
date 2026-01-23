import { supabase } from '../supabaseClient';

export const reviewsApi = {
  async list() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('리뷰 목록 조회 실패:', error);
      throw error;
    }
    return data || [];
  },

  async listFeatured(limit = 3) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('추천 리뷰 조회 실패:', error);
      throw error;
    }
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('리뷰 조회 실패:', error);
      throw error;
    }
    return data;
  }
};
