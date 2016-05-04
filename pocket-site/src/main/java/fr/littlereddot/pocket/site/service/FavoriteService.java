package fr.littlereddot.pocket.site.service;

import fr.littlereddot.pocket.client.resource.FavoriteResource;
import fr.littlereddot.pocket.core.dto.request.FavoriteDto;
import fr.littlereddot.pocket.core.dto.request.FavoritesRequest;
import fr.littlereddot.pocket.core.dto.response.FavoriteResultDto;
import fr.littlereddot.pocket.core.dto.response.FavoritesResponseDto;
import fr.littlereddot.pocket.core.entity.User;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Guillaume Le Biller (<i>guillaume.lebiller@gmail.com</i>)
 * @version $Id$
 */
@Service
public class FavoriteService {

    @Autowired
    private FavoriteResource favoriteResource;

    public FavoritesResponseDto getByUser(User principal) {
        FavoritesRequest favoritesRequest = new FavoritesRequest();
        favoritesRequest.setIds(principal.getFavoritesIds());
        favoritesRequest.setUserId(principal.getId());
        return favoriteResource.getByIds(favoritesRequest);
    }

    public FavoriteResultDto save(User user, ObjectId subjectId, boolean favorite) {
        FavoriteDto favoriteDto = new FavoriteDto();
        favoriteDto.setUserId(user.getId());
        favoriteDto.setSubjectId(subjectId);
        favoriteDto.setFavorite(favorite);
        FavoriteResultDto result = favoriteResource.save(favoriteDto);
        if (result != null) {
            if (favorite) {
                user.getFavoritesIds().add(subjectId);
            } else {
                user.getFavoritesIds().remove(subjectId);
            }
        }
        return result;
    }
}
